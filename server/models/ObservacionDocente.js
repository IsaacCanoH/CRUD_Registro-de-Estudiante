const { Schema, Model } = require("mongoose");

const ObservacioDocenteSchema = new Schema({
    MatriculaAlumno: { type: String, required: true },
    NombreCompletoAlumno: { type: String, required: true },
    NombreCompletoDocente: { type: String, required: true },
    NombreAsignatura: { type: String, required: true },
    Semestre: { type: Number, required: true },
    Año: { type: Number, required: true },
    Descripcion: { type: String, required: true }
})

module.exports = model("ObservacionDocente", EstudianteSchema, "ObservacionDocente");