const { Schema, model } = require("mongoose");

const ActividadesExtracurricularesSchema = new Schema({
    NombreActividadExtracurricular: { type: String }
});

module.exports = model("ActividadesExtracurriculares", ActividadesExtracurricularesSchema, "ActividadesExtracurriculares");