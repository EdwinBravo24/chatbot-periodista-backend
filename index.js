// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mensajeRoutes = require('./routes/mensajeRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const { verificarConexion } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Validación de API KEY
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Falta la variable OPENAI_API_KEY en el archivo .env');
  process.exit(1);
}

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  // puedes agregar opciones aquí si las necesitas
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => {
  console.error('❌ Error al conectar MongoDB:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/chat', mensajeRoutes);       // Rutas para mensajes/chat
app.use('/api/usuarios', usuarioRoutes);   // Rutas para usuarios

// Servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  
  // Verificar conexión de email
  await verificarConexion();
});