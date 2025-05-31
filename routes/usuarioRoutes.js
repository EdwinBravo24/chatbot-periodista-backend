// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { registrarUsuario, obtenerUsuarios, loginUsuario, cerrarSesion } = require('../controllers/usuarioController');

// Registro
router.post('/registrar', registrarUsuario);

// Login - usando el controlador actualizado
router.post('/login', loginUsuario);

// Cerrar sesión y enviar historial
router.post('/logout', cerrarSesion);

// Obtener usuarios
router.get('/', obtenerUsuarios);

module.exports = router