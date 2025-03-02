const { Schema, model } = require("mongoose");

const DomicilioSchema = new Schema({
    Calle: { type: String, required: true },
    NumeroInterior: { type: Number, default: 0 },
    NumeroExterior: { type: Number, default: 0 },
    Colonia: { type: String, required: true },
    CodigoPostal: { type: String, required: true },
    Ciudad: { type: String, required: true }
});

const TutorSchema = new Schema({
    Nombre: { type: String, required: true },
    ApellidoPaterno: { type: String, required: true },
    ApellidoMaterno: { type: String, required: true },
    Telefonos: { type: [String], default: [] },
    CorreosElectronicos: { type: [String], default: [] },
    Domicilio: DomicilioSchema
});

const EstudianteSchema = new Schema({
    Matricula: { type: String, required: true },
    Nombre: { type: String, required: true },
    ApellidoPaterno: { type: String, required: true },
    ApellidoMaterno: { type: String, required: true },
    FechaAlta: { type: Date, default: Date.now },
    FechaNacimiento: { type: Date, required: true },
    Sexo: { type: String, required: true },
    Telefonos: { type: [String], default: [] },
    CorreosElectronicos: { type: [String], default: [] },
    Foto: { type: String, default: "" },
    RFC: { type: String, required: true },
    Semestre: { type: Number, required: true },
    Año: { type: Number, required: true },
    Domicilio: DomicilioSchema,
    PromedioBachillerato: { type: Number, required: true },
    EspecialidadBachillerato: { type: String, required: true },
    CertificadoBachillerato: { type: Number, required: true },
    NombreCarrera: { type: String, required: true },
    Especialidad: { type: String, required: true },
    Tutor: TutorSchema
});

module.exports = model("Estudiante", EstudianteSchema, "Estudiante");
