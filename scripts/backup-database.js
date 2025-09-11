const { MongoClient } = require("mongodb")
const fs = require("fs")
const path = require("path")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clash-royale-tournament"

async function backupDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Conectado a MongoDB para backup")

    const db = client.db()
    const players = await db.collection("players").find({}).toArray()

    const backupData = {
      timestamp: new Date().toISOString(),
      playersCount: players.length,
      players: players,
    }

    const backupDir = path.join(__dirname, "..", "backups")
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    const filename = `backup-${new Date().toISOString().split("T")[0]}-${Date.now()}.json`
    const filepath = path.join(backupDir, filename)

    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2))

    console.log(`✅ Backup creado exitosamente: ${filename}`)
    console.log(`📁 Ubicación: ${filepath}`)
    console.log(`👥 Jugadores respaldados: ${players.length}`)
  } catch (error) {
    console.error("❌ Error creando backup:", error)
  } finally {
    await client.close()
  }
}

// Ejecutar backup si se llama directamente
if (require.main === module) {
  backupDatabase()
}

module.exports = { backupDatabase }
