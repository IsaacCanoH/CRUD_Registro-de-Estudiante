const { Schema, model } = require("mongoose");

// Función para generar RFC automáticamente
const generarRFC = (nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento) => {
    const primeraLetraNombre = nombre.charAt(0).toUpperCase();
    const primerasDosApellidoPaterno = apellidoPaterno.substring(0, 2).toUpperCase();
    const primeraApellidoMaterno = apellidoMaterno.charAt(0).toUpperCase();
    
    const fecha = new Date(fechaNacimiento);
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${primerasDosApellidoPaterno}${primeraApellidoMaterno}${primeraLetraNombre}${año}${mes}${dia}`;
};


// Función para generar matrícula automáticamente
const generarMatricula = async function (apellidoPaterno, fechaAlta, semestre) {
    const año = fechaAlta.getFullYear().toString().slice(-2);
    const primeraLetraApellido = apellidoPaterno.charAt(0).toUpperCase();
    
    // Obtener el último estudiante registrado para generar el consecutivo
    const ultimoEstudiante = await this.constructor.findOne({}, {}, { sort: { Matricula: -1 } });

    let consecutivo = 1;
    if (ultimoEstudiante) {
        const ultimaMatricula = ultimoEstudiante.Matricula;
        const ultimoConsecutivo = parseInt(ultimaMatricula.slice(-4), 10);
        consecutivo = ultimoConsecutivo + 1;
    }

    return `${año}${semestre}${primeraLetraApellido}${String(consecutivo).padStart(4, "0")}`;
};

// Esquema de domicilio
const DomicilioSchema = new Schema({
    Calle: { type: String, required: true },
    NumeroInterior: { type: Number, default: 0 },
    NumeroExterior: { type: Number, default: 0 },
    Colonia: { type: String, required: true },
    CodigoPostal: { type: String, required: true },
    Ciudad: { type: String, required: true }
});

// Esquema de tutor
const TutorSchema = new Schema({
    Nombre: { type: String, required: true },
    ApellidoPaterno: { type: String, required: true },
    ApellidoMaterno: { type: String, required: true },
    Telefonos: { type: [String], default: [] },
    CorreosElectronicos: {
        type: [String],
        default: [],
        validate: {
            validator: function (correos) {
                return correos.every(correo => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo));
            },
            message: "Formato de correo inválido"
        }
    },
    Domicilio: DomicilioSchema
});

// Esquema de estudiante
const EstudianteSchema = new Schema({
    Matricula: { type: String, unique: true },
    Nombre: { type: String, required: true },
    ApellidoPaterno: { type: String, required: true },
    ApellidoMaterno: { type: String, required: true },
    FechaAlta: { type: Date, default: Date.now },
    FechaNacimiento: { type: Date, required: true },
    Sexo: { type: String, required: true },
    Telefonos: { type: [String], default: [] },
    CorreosElectronicos: {
        type: [String],
        default: [],
        validate: {
            validator: function (correos) {
                return correos.every(correo => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo));
            },
            message: "Formato de correo inválido"
        }
    },
    Foto: { type: String, default: "" },
    RFC: { type: String, unique: true },
    Semestre: { type: Number, required: true },
    Año: { type: Number, required: true },
    Domicilio: DomicilioSchema,
    PromedioBachillerato: { type: Number, required: true },
    EspecialidadBachillerato: { type: String, required: true },
    CertificadoBachillerato: { type: Number, required: true },
    NombreCarrera: { type: String, required: true },
    Especialidad: { type: String, required: true },
    Tutor: TutorSchema,
    Estatus: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" }
});

// Middleware para generar automáticamente RFC y matrícula antes de guardar
EstudianteSchema.pre("save", async function (next) {
    if (!this.RFC) {
        this.RFC = generarRFC(this.Nombre, this.ApellidoPaterno, this.ApellidoMaterno, this.FechaNacimiento);
    }

    if (!this.Matricula) {
        this.Matricula = await generarMatricula.call(this, this.ApellidoPaterno, this.FechaAlta, this.Semestre);
    }

    next();
});

// Método para actualizar estudiante
EstudianteSchema.statics.actualizarEstudiante = async function (id, nuevosDatos) {
    return await this.findByIdAndUpdate(id, nuevosDatos, { new: true, runValidators: true });
};

// Método para baja temporal (cambiar estatus)
EstudianteSchema.statics.bajaTemporal = async function (id) {
    return await this.findByIdAndUpdate(id, { Estatus: "Inactivo" }, { new: true });
};

// Método para baja definitiva (eliminar estudiante)
EstudianteSchema.statics.bajaDefinitiva = async function (id) {
    return await this.findByIdAndDelete(id);
};

// Exportar modelo
module.exports = model("Estudiante", EstudianteSchema, "Estudiante");
