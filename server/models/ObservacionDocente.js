const { Schema, model } = require("mongoose");

const ObservacioDocenteSchema = new Schema({
    Matricula: { type: String, required: true },
    NombreCompletoAlumno: { type: String, required: true },
    NombreCompletoDocente: { type: String, required: true },
    NombreAsignatura: { type: String, required: true },
    Semestre: { type: Number, required: true },
    Año: { type: Number, required: true },
    Descripcion: { type: String, required: true }
})

module.exports = model("ObservacionDocente", ObservacioDocenteSchema, "ObservacionDocente");