
// models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  contraseña: String
});

module.exports = mongoose.model('Usuario', usuarioSchema);

