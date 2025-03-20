const mongoose = require('mongoose');

const CiudadSchema = new mongoose.Schema({
  Ciudad: { type: String, required: true }
});

module.exports = mongoose.model("Ciudad", CiudadSchema, "Ciudad");
