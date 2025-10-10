import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("🔗 Conectando a:", MONGODB_URI);

let db;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ------------------ CONEXIÓN A MONGODB ------------------
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}

// ------------------ CÁLCULO DE ESTADÍSTICAS ------------------
function calculatePlayerStats(player) {
  let totalWins = 0;
  let totalLosses = 0;
  let totalCrowns = 0;
  let points = 0;

  const gameModes = ["megaSelection", "elixirX3", "classicDeck"];

  gameModes.forEach((mode) => {
    if (!player[mode] || typeof player[mode] !== "object") {
      player[mode] = { wins: 0, losses: 0, crowns: 0 };
    }

    const { wins = 0, losses = 0, crowns = 0 } = player[mode];

    totalWins += wins;
    totalLosses += losses;
    totalCrowns += crowns;

    points += wins * 3 + crowns;
  });

  player.wins = totalWins;
  player.losses = totalLosses;
  player.totalCrowns = totalCrowns;
  player.points = points;

  return player;
}

// ------------------ API ------------------

// Obtener todos los jugadores
app.get("/api/scores", async (req, res) => {
  try {
    const players = await db.collection("players").find({}).toArray();
    const processedPlayers = players.map((player) =>
      calculatePlayerStats({ ...player })
    );

    // Ordenar por puntos, coronas y victorias
    processedPlayers.sort(
      (a, b) =>
        b.points - a.points ||
        b.totalCrowns - a.totalCrowns ||
        b.wins - a.wins
    );

    res.json(processedPlayers);
  } catch (error) {
    console.error("Error al obtener los jugadores:", error);
    res.status(500).json({ error: "Error al obtener los jugadores" });
  }
});

// Crear nuevo jugador
app.post("/api/scores", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ error: "El nombre es obligatorio" });

    const existing = await db
      .collection("players")
      .findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });

    if (existing)
      return res.status(400).json({ error: "El jugador ya existe" });

    const newPlayer = {
      name: name.trim(),
      megaSelection: { wins: 0, losses: 0, crowns: 0 },
      elixirX3: { wins: 0, losses: 0, crowns: 0 },
      classicDeck: { wins: 0, losses: 0, crowns: 0 },
    };

    calculatePlayerStats(newPlayer);

    const result = await db.collection("players").insertOne(newPlayer);
    newPlayer._id = result.insertedId;

    res.status(201).json(newPlayer);
  } catch (error) {
    console.error("Error al crear jugador:", error);
    res.status(500).json({ error: "Error al crear jugador" });
  }
});

// Actualizar estadísticas de jugador
app.put("/api/scores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "ID inválido" });

    const current = await db
      .collection("players")
      .findOne({ _id: new ObjectId(id) });

    if (!current)
      return res.status(404).json({ error: "Jugador no encontrado" });

    const { megaSelection, elixirX3, classicDeck } = req.body;

    const updatedPlayer = { ...current };

    const updateMode = (mode, data) => {
      if (!data) return;
      const win = data.win || false;
      const crowns = data.crowns || 0;

      // Inicializar si falta
      if (!updatedPlayer[mode]) updatedPlayer[mode] = { wins: 0, losses: 0, crowns: 0 };

      updatedPlayer[mode].wins += win ? 1 : 0;
      updatedPlayer[mode].losses += win ? 0 : 1;
      updatedPlayer[mode].crowns += crowns;
    };

    updateMode("megaSelection", megaSelection);
    updateMode("elixirX3", elixirX3);
    updateMode("classicDeck", classicDeck);

    calculatePlayerStats(updatedPlayer);

    // Eliminar _id antes de actualizar
    const { _id, ...dataToUpdate } = updatedPlayer;

    await db
      .collection("players")
      .updateOne({ _id: new ObjectId(id) }, { $set: dataToUpdate });

    const refreshed = await db
      .collection("players")
      .findOne({ _id: new ObjectId(id) });

    res.json(calculatePlayerStats(refreshed));
  } catch (error) {
    console.error("Error al actualizar jugador:", error);
    res.status(500).json({ error: "Error al actualizar jugador" });
  }
});

// Eliminar jugador
app.delete("/api/scores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: "ID inválido" });

    const result = await db
      .collection("players")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Jugador no encontrado" });

    res.json({ message: "Jugador eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar jugador:", error);
    res.status(500).json({ error: "Error al eliminar jugador" });
  }
});

// ------------------ RUTAS ESTÁTICAS ------------------
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "admin.html"))
);
app.get("/admin-dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"))
);

// ------------------ INICIAR SERVIDOR ------------------
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});
