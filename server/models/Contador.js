const { Schema, model } = require("mongoose");

const ContadorSchema = new Schema({
  nombre: { type: String, required: true, unique: true }, // Identificador del contador
  valor: { type: Number, required: true, default: 1 } // Inicia en 1
});

module.exports = model("Contador", ContadorSchema, "Contador");