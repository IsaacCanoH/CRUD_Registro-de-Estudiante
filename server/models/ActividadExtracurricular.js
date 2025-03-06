const { Schema, model } = require("mongoose");

const ActividadExtracurricularSchema = new Schema({
    Matricula: { type: String, required: true },
    NombreDocente: { type: String, required: true },
    NombreActividadExtracurricular: { type: String, required: true },
    FechaInicio: { type: Date, required: true },
    FechaTermino: { type: Date, required: true },
    Resultado: { type: String, required: true }
});

module.exports = model("ActividadExtracurricular", ActividadExtracurricularSchema, "ActividadExtracurricular");