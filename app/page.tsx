"use client"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center p-4">
     
      
       <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">🏆 Clash Royale Tournament</h1>
        <p className="text-xl text-blue-200 mb-8">Bienvenido al sistema de torneo oficial</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/index.html"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            📊 Ver Clasificación Pública
          </a>

          <a
            href="/admin.html"
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ⚙️ Panel de Administración
          </a>
        </div>

        <div className="mt-8 text-blue-300">
          <p>Sistema completo de gestión de torneos con:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Clasificación en tiempo real</li>
            <li>Gestión de 3 modalidades de juego</li>
            <li>Panel administrativo completo</li>
            <li>Exportación de datos CSV</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
