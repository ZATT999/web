const { MongoClient } = require("mongodb")
const fs = require("fs")
const path = require("path")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clash-royale-tournament"

async function restoreDatabase(backupFile) {
  if (!backupFile) {
    console.error("❌ Debes especificar un archivo de backup")
    console.log("Uso: node restore-database.js <archivo-backup.json>")
    return
  }

  const backupPath = path.resolve(backupFile)

  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Archivo no encontrado: ${backupPath}`)
    return
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    const backupData = JSON.parse(fs.readFileSync(backupPath, "utf8"))

    await client.connect()
    console.log("Conectado a MongoDB para restauración")

    const db = client.db()
    const playersCollection = db.collection("players")

    // Limpiar colección existente
    await playersCollection.deleteMany({})
    console.log("🗑️ Datos existentes eliminados")

    // Restaurar datos
    if (backupData.players && backupData.players.length > 0) {
      await playersCollection.insertMany(backupData.players)
      console.log(`✅ Restaurados ${backupData.players.length} jugadores`)
    }

    console.log(`📅 Backup del: ${backupData.timestamp}`)
    console.log("🎉 Restauración completada exitosamente")
  } catch (error) {
    console.error("❌ Error restaurando backup:", error)
  } finally {
    await client.close()
  }
}

// Obtener archivo de argumentos de línea de comandos
const backupFile = process.argv[2]
restoreDatabase(backupFile)
