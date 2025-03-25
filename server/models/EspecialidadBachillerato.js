const mongoose = require('mongoose');

const EspecialidadBachilleratoSchema = new mongoose.Schema({
  NombreEspecialidadBachillerato: { type: String, required: true }
});

module.exports = mongoose.model("EspecialidadBachillerato", EspecialidadBachilleratoSchema, "EspecialidadBachillerato");
