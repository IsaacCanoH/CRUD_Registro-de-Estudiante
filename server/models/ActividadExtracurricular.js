const { Schema, model } = require("mongoose");

const ActividadExtracurricularSchema = new Schema({
    MatriculaAlumno: { 
        type: String, 
        required: [true, "¡La matricual es obligatoria!"] 
    },
    NombreDocente: { 
        type: String, 
        required: [true, "¡El nombre del docente es oligatorio!"] 
    },
    NombreActividadExtracurricular: { 
        type: String, 
        required: [true, "¡La actividad es obligatoria!"] 
    },
    FechaInicio: { 
        type: Date, 
        required: [true, "¡La fecha de inicio es obligatoria!"] 
    },
    FechaTermino: { 
        type: Date, 
        required: [true, "¡La fecha de termino es obligatoria!"],
        validate: {
            validator: function(value) {
                return this.FechaInicio ? value > this.FechaInicio : true;
            },
            message: "¡La fecha de termino debe ser mayor que la fecha de inicio!"
        } 
    },
    Resultado: { 
        type: String, 
        required: [true, "¡El resultado es obligatorio!"] 
    }
});

module.exports = model("ActividadExtracurricular", ActividadExtracurricularSchema, "ActividadExtracurricular");