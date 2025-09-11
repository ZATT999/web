const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clash-royale-tournament"

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const playersCollection = db.collection("players")

    // Clear existing data
    await playersCollection.deleteMany({})
    console.log("Cleared existing players")

    // Sample tournament players
    const tournamentPlayers = [
      {
        name: "ElPekka",
        megaSelection: { win: true, crowns: 3 },
        elixirX3: { win: false, crowns: 1 },
        classicDeck: { win: true, crowns: 2 },
      },
      {
        name: "WizardKing",
        megaSelection: { win: true, crowns: 2 },
        elixirX3: { win: true, crowns: 3 },
        classicDeck: { win: false, crowns: 0 },
      },
      {
        name: "DragonMaster",
        megaSelection: { win: false, crowns: 1 },
        elixirX3: { win: true, crowns: 1 },
        classicDeck: { win: true, crowns: 3 },
      },
      {
        name: "IceQueen",
        megaSelection: { win: true, crowns: 1 },
        elixirX3: { win: false, crowns: 2 },
        classicDeck: { win: true, crowns: 2 },
      },
      {
        name: "FireSpirit",
        megaSelection: { win: false, crowns: 0 },
        elixirX3: { win: true, crowns: 2 },
        classicDeck: { win: false, crowns: 1 },
      },
    ]

    // Calculate stats for each player
    tournamentPlayers.forEach((player) => {
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
            points += 3 // 3 points per win
          } else {
            losses++
          }
          points += player[mode].crowns || 0 // 1 point per crown
        }
      })

      player.wins = wins
      player.losses = losses
      player.totalCrowns = totalCrowns
      player.points = points
    })

    // Insert players
    const result = await playersCollection.insertMany(tournamentPlayers)
    console.log(`Inserted ${result.insertedCount} players`)

    // Display results
    const players = await playersCollection.find({}).sort({ points: -1 }).toArray()
    console.log("\nTournament Leaderboard:")
    console.log("========================")
    players.forEach((player, index) => {
      console.log(
        `${index + 1}. ${player.name} - ${player.points} pts (${player.wins}W/${player.losses}L, ${player.totalCrowns} crowns)`,
      )
    })
  } catch (error) {
    console.error("Database initialization error:", error)
  } finally {
    await client.close()
    console.log("\nDatabase initialization complete!")
  }
}

initializeDatabase()
