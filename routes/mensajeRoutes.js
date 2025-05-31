// routes/mensajeRoutes.js
const express = require('express');
const router = express.Router();

const { crearMensaje, obtenerHistorial, obtenerHistorialPorUsuario } = require('../controllers/mensajeControllers');

// Ruta para crear mensaje
router.post('/', crearMensaje);

// Ruta para obtener historial general (admin)
router.get('/historial', obtenerHistorial);

// NUEVA RUTA: Obtener historial específico por usuario
router.get('/historial/:usuarioId', obtenerHistorialPorUsuario);

module.exports = router;