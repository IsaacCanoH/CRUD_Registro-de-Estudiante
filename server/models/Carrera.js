const mongoose = require('mongoose');

const CarreraSchema = new mongoose.Schema({
  NombreCarrera: { type: String, required: true },
  Especialidades: [{ type: String, required: true }]
});

module.exports = mongoose.model("Carrera", CarreraSchema, "Carrera");
