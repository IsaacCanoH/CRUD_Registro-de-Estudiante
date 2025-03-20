const { Schema, model } = require("mongoose");

const ObservacioDocenteSchema = new Schema({
    MatriculaAlumno: { 
        type: String, 
        required: [true, "Es obligatoria la matrícula."] 
    },
    NombreCompletoAlumno: { 
        type: String, 
        required: [true, "Es obligatorio el nombre del estudiante."] 
    },
    NombreCompletoDocente: { 
        type: String, 
        required: [true, "Por favor, seleccione el docente."] 
    },
    NombreAsignatura: { 
        type: String, 
        required: [true, "Por favor, seleccione la asignatura."]
    },
    Semestre: { 
        type: Number, 
        required: [true, "Es obligatorio el año."]
    },
    Anio: { 
        type: Number, 
        required: [true, "Es obligatorio el semestre."]
    },
    Descripcion: { 
        type: String, 
        required: [true, "Por favor, agregue la observación."]
    }
})

module.exports = model("ObservacionDocente", ObservacioDocenteSchema, "ObservacionDocente");