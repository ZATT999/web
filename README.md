# 🏆 Torneo Clash Royale - Sistema de Gestión

Un sistema completo de gestión de torneos para Clash Royale con interfaz pública y panel de administración.

## 🚀 Características

- **Clasificación en tiempo real** con sistema de puntos (3 puntos por victoria + 1 punto por corona)
- **Tres modalidades de juego**: Megaselección, Elixir x3, y Batalla Clásica
- **Panel de administración** con autenticación para gestionar jugadores
- **Diseño responsive** con efectos glassmorphism inspirados en Clash Royale
- **Exportación CSV** de la clasificación
- **API REST completa** para todas las operaciones CRUD

## 🛠️ Tecnologías

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Styling**: Tailwind CSS + efectos glassmorphism personalizados
- **Base de datos**: MongoDB con esquemas optimizados
- **Autenticación**: Sistema de sesiones simple para administradores

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
   \`\`\`bash
   git clone <repository-url>
   cd clash-royale-tournament
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del proyecto:
   \`\`\`env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/clash-royale-tournament
   \`\`\`

4. **Inicializar la base de datos**
   \`\`\`bash
   npm run init-db
   \`\`\`

5. **Iniciar el servidor**
   \`\`\`bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   \`\`\`

## 🎮 Uso

### Página Pública
- Accede a `http://localhost:3001` para ver la clasificación pública
- Actualiza datos en tiempo real
- Descarga la clasificación en formato CSV

### Panel de Administración
- Accede a `http://localhost:3001/admin`
- **Contraseña por defecto**: `admin123`
- Gestiona jugadores (agregar, editar, eliminar)
- Actualiza resultados de partidas

## 📊 Sistema de Puntuación

- **Victoria**: 3 puntos + coronas obtenidas
- **Derrota**: Solo coronas obtenidas
- **Clasificación**: Por puntos totales, luego por coronas, luego por victorias

## 🗄️ Estructura de la Base de Datos

### Colección: `players`

\`\`\`javascript
{
  name: String,                    // Nombre del jugador
  megaSelection: {                 // Resultados Megaselección
    win: Boolean,
    crowns: Number
  },
  elixirX3: {                     // Resultados Elixir x3
    win: Boolean,
    crowns: Number
  },
  classicDeck: {                  // Resultados Batalla Clásica
    win: Boolean,
    crowns: Number
  },
  points: Number,                 // Puntos totales (calculado)
  wins: Number,                   // Victorias totales (calculado)
  losses: Number,                 // Derrotas totales (calculado)
  totalCrowns: Number            // Coronas totales (calculado)
}
\`\`\`

## 🔌 API Endpoints

### Obtener clasificación
\`\`\`http
GET /api/scores
\`\`\`

### Agregar jugador
\`\`\`http
POST /api/scores
Content-Type: application/json

{
  "name": "NombreJugador"
}
\`\`\`

### Actualizar jugador
\`\`\`http
PUT /api/scores/:id
Content-Type: application/json

{
  "megaSelection": { "win": true, "crowns": 3 },
  "elixirX3": { "win": false, "crowns": 1 },
  "classicDeck": { "win": true, "crowns": 2 }
}
\`\`\`

### Eliminar jugador
\`\`\`http
DELETE /api/scores/:id
\`\`\`

## 🎨 Personalización

### Cambiar contraseña de administrador
Edita la variable `ADMIN_PASSWORD` en `public/admin.html`:
\`\`\`javascript
const ADMIN_PASSWORD = 'tu_nueva_contraseña';
\`\`\`

### Modificar colores del tema
Los colores están definidos en las variables CSS de cada archivo HTML:
\`\`\`css
:root {
  --primary: #0A74DA;    /* Azul principal */
  --accent: #FFD700;     /* Dorado de acentos */
  --background: #F0F4FF; /* Fondo suave */
}
\`\`\`

## 📱 Responsive Design

- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Tablas responsive**: Scroll horizontal en pantallas pequeñas
- **Botones adaptativos**: Tamaños y espaciado optimizados

## 🔒 Seguridad

- Validación de entrada en cliente y servidor
- Límite de intentos de login (3 intentos)
- Sesiones con expiración automática (24 horas)
- Sanitización de datos de entrada
- Protección contra inyección NoSQL

## 🚀 Despliegue

### Heroku
1. Crear app en Heroku
2. Configurar MongoDB Atlas
3. Establecer variables de entorno
4. Desplegar con Git

### Vercel (Frontend) + MongoDB Atlas
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Docker
\`\`\`dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
\`\`\`

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que MongoDB esté ejecutándose
- Comprobar la URI de conexión en `.env`
- Verificar permisos de red (si usas MongoDB Atlas)

### Problemas de CORS
- El servidor incluye configuración CORS para desarrollo
- Para producción, ajustar los orígenes permitidos

### Datos no se actualizan
- Verificar que el servidor esté ejecutándose en el puerto correcto
- Comprobar la consola del navegador para errores de red

## 📄 Licencia

MIT License - Ver archivo `LICENSE` para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para nueva característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📞 Soporte

Para reportar bugs o solicitar características:
- Crear un issue en GitHub
- Incluir pasos para reproducir el problema
- Especificar versión de Node.js y sistema operativo

---

**¡Que comience el torneo!** 🏆⚔️
