// controllers/usuarioControllers.js
const Usuario = require('../models/Usuario');
const Mensaje = require('../models/Mensaje');
const { enviarHistorialPorEmail } = require('../services/emailService');

// Registrar usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const existeUsuario = await Usuario.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({ error: 'Correo ya registrado' });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña,
      fechaRegistro: new Date()
    });

    await nuevoUsuario.save();

    return res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      }
    });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Login modificado para devolver también el ID
const loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo, contraseña });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Devolvemos el ID del usuario también
    res.json({ 
      mensaje: 'Login exitoso', 
      nombre: usuario.nombre,
      id: usuario._id,  // Agregamos el ID
      correo: usuario.correo
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
};

// NUEVA FUNCIÓN: Cerrar sesión y enviar historial
const cerrarSesion = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ error: 'ID de usuario requerido' });
    }

    // Buscar usuario
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener historial del usuario
    const mensajes = await Mensaje.find({ usuarioId }).sort({ fecha: 1 });
    
    // Convertir a formato para email
    const historialFormateado = [];
    mensajes.forEach(mensaje => {
      historialFormateado.push({
        sender: 'user',
        text: mensaje.pregunta,
        fecha: mensaje.fecha
      });
      historialFormateado.push({
        sender: 'bot',
        text: mensaje.respuesta,
        fecha: mensaje.fecha
      });
    });

    // Enviar email si hay historial
    let emailResult = { success: false, message: 'Sin historial para enviar' };
    
    if (historialFormateado.length > 0) {
      emailResult = await enviarHistorialPorEmail(
        usuario.correo,
        usuario.nombre,
        historialFormateado
      );
    }

    res.json({
      mensaje: 'Sesión cerrada exitosamente',
      historialEnviado: emailResult.success,
      detalleEmail: emailResult.message,
      totalMensajes: Math.floor(historialFormateado.length / 2)
    });

  } catch (error) {
    console.error('Error cerrando sesión:', error);
    res.status(500).json({ 
      error: 'Error al cerrar sesión',
      historialEnviado: false 
    });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ fechaRegistro: -1 });
    return res.json(usuarios);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  registrarUsuario,
  obtenerUsuarios,
  loginUsuario,
  cerrarSesion // Nueva función exportada
};