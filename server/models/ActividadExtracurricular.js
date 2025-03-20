const { Schema, model } = require("mongoose");

const ActividadExtracurricularSchema = new Schema({
    MatriculaAlumno: { 
        type: String, 
        required: [true, "Es obligatoria la matrícula."] 
    },
    NombreDocente: { 
        type: String, 
        required: [true, "Por favor, seleccione el docente."] 
    },
    NombreActividadExtracurricular: { 
        type: String, 
        required: [true, "Por favor, seleccione la actividad."] 
    },
    FechaInicio: { 
        type: Date, 
        required: [true, "Por favor, seleccione la fecha de inicio."] 
    },
    FechaTermino: { 
        type: Date, 
        required: [true, "Por favor, seleccione la fecha de fin."],
        validate: {
            validator: function(value) {
                return this.FechaInicio ? value > this.FechaInicio : true;
            },
            message: "La fecha de fin no puede ser menor a la fecha de inicio."
        } 
    },
    Resultado: { 
        type: String, 
        required: [true, "Por favor, seleccione el resultado."] 
    }
});

module.exports = model("ActividadExtracurricular", ActividadExtracurricularSchema, "ActividadExtracurricular");