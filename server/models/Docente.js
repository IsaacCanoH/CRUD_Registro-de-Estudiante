const { Schema, model } = require("mongoose");

const DocenteSchema = new Schema({
    NombreCompletoDocente: { type: String },
    Asignatura: { type: String },
    Año: { type: Number },
    Semestre: { type: Number }
});

module.exports = model("Docente", DocenteSchema,"Docente");
