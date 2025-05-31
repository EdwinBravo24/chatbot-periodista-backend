const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false,
  },
  pregunta: {
    type: String,
    required: true,
  },
  respuesta: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Mensaje', mensajeSchema);


