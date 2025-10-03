import express from "express"
import { MongoClient, ObjectId } from "mongodb"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

// Cargar variables de entorno
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI
console.log(MONGODB_URI)

let db

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Conexión a MongoDB Atlas
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db()
    console.log("✅ Conectado a MongoDB Atlas")

  } catch (error) {
    console.error("❌ Error conectando a MongoDB Atlas:", error.message)
    process.exit(1)
  }
}

// Calcular estadísticas de un jugador
function calculatePlayerStats(player) {
  let wins = 0
  let losses = 0
  let totalCrowns = 0
  let points = 0

  const gameModes = ["megaSelection", "elixirX3", "classicDeck"]

  gameModes.forEach((mode) => {
    if (player[mode]) {
      totalCrowns += player[mode].crowns || 0
      if (player[mode].win) {
        wins++
        points += 3
      } else {
        losses++
      }
      points += player[mode].crowns || 0
    }
  })

  player.wins = wins
  player.losses = losses
  player.totalCrowns = totalCrowns
  player.points = points
  return player
}

// ------------------ API ------------------

// GET /api/scores
app.get("/api/scores", async (req, res) => {
  try {
    const players = await db
      .collection("players")
      .find({})
      .sort({ points: -1, totalCrowns: -1, wins: -1 })
      .toArray()

    res.json(players)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scores" })
  }
})

// POST /api/scores
app.post("/api/scores", async (req, res) => {
  try {
    const { name } = req.body
    if (!name || name.trim() === "")
      return res.status(400).json({ error: "Player name is required" })

    const existingPlayer = await db.collection("players").findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    })
    if (existingPlayer)
      return res.status(400).json({ error: "Player already exists" })

    const newPlayer = {
      name: name.trim(),
      megaSelection: { win: false, crowns: 0 },
      elixirX3: { win: false, crowns: 0 },
      classicDeck: { win: false, crowns: 0 },
      points: 0,
      wins: 0,
      losses: 0,
      totalCrowns: 0,
    }

    const result = await db.collection("players").insertOne(newPlayer)
    newPlayer._id = result.insertedId
    res.status(201).json(newPlayer)
  } catch {
    res.status(500).json({ error: "Failed to add player" })
  }
})

// PUT /api/scores/:id
app.put("/api/scores/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid player ID" })

    const currentPlayer = await db
      .collection("players")
      .findOne({ _id: new ObjectId(id) })
    if (!currentPlayer)
      return res.status(404).json({ error: "Player not found" })

    const updatedPlayer = { ...currentPlayer, ...req.body }
    calculatePlayerStats(updatedPlayer)
    delete updatedPlayer._id

    await db
      .collection("players")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedPlayer })

    const player = await db
      .collection("players")
      .findOne({ _id: new ObjectId(id) })
    res.json(player)
  } catch {
    res.status(500).json({ error: "Failed to update player" })
  }
})

// DELETE /api/scores/:id
app.delete("/api/scores/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid player ID" })

    const result = await db
      .collection("players")
      .deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Player not found" })

    res.json({ message: "Player deleted successfully" })
  } catch {
    res.status(500).json({ error: "Failed to delete player" })
  }
})

// ------------------ Rutas estáticas ------------------
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
)
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "admin.html"))
)
app.get("/admin-dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"))
)

// ------------------ Iniciar server ------------------
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`)
  })
})
