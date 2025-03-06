const { Model, model } = require("mongoose");
const Estudiante = require("../models/Estudiante");

const quitarAcentos = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Función para generar RFC automáticamente
const generarRFC = (nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento) => {
    // Eliminar acentos antes de extraer las letras
    nombre = quitarAcentos(nombre);
    apellidoPaterno = quitarAcentos(apellidoPaterno);
    apellidoMaterno = quitarAcentos(apellidoMaterno);

    const primeraLetraNombre = nombre.charAt(0).toUpperCase();
    const primerasDosApellidoPaterno = apellidoPaterno.substring(0, 2).toUpperCase();
    const primeraApellidoMaterno = apellidoMaterno.charAt(0).toUpperCase();
    
    const fecha = new Date(fechaNacimiento);
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${primerasDosApellidoPaterno}${primeraApellidoMaterno}${primeraLetraNombre}${año}${mes}${dia}`;
};

// Metodo para crear estudiante
const crearEstudiante = async (req, res) => {
    try {
        const {
            Nombre,
            ApellidoPaterno,
            ApellidoMaterno,
            FechaNacimiento,
            Sexo,
            Telefonos,
            CorreosElectronicos,
            Foto,
            Semestre,
            Año,
            Domicilio,
            PromedioBachillerato,
            EspecialidadBachillerato,
            CertificadoBachillerato,
            NombreCarrera,
            Especialidad,
            Tutor
        } = req.body;

        // Verificar si ya existe un estudiante con el mismo RFC
        const rfcGenerado = generarRFC(Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento);

        if (rfcGenerado) {
            const existeRFC = await Estudiante.findOne({ RFC: rfcGenerado });
            if (existeRFC) {
                return res.status(400).json({ message: "El estudiante ya está registrado con este RFC." });
            }
        }

        // Crear una nueva instancia del modelo Estudiante
        const nuevoEstudiante = new Estudiante({
            Nombre,
            ApellidoPaterno,
            ApellidoMaterno,
            FechaNacimiento,
            Sexo,
            Telefonos,
            CorreosElectronicos,
            Foto,
            Semestre,
            Año,
            Domicilio,
            PromedioBachillerato,
            EspecialidadBachillerato,
            CertificadoBachillerato,
            NombreCarrera,
            Especialidad,
            Tutor
        });

        // Guardar en la base de datos
        await nuevoEstudiante.save();

        return res.status(201).json({ message: "Estudiante registrado exitosamente", estudiante: nuevoEstudiante });
    } catch (error) {
        console.error("Error al registrar estudiante:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Metodo para visualizar todos los estudiantes
const getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find();
        return res.status(200).json(estudiantes);
    } catch (error){
        console.error("Error al obtener estudiantes:", error);
        return res.status(500).json({message: "Error interno del servidor",error: error.message});
    }
}

// Metodo para visualizar los estudiantes activos
const getActiveEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find({ Estatus:"Activo" });
        return res.status(200).json(estudiantes);
    } catch (error){
        console.error("Error al obtener estudiantes:", error);
        return res.status(500).json({message: "Error interno del servidor",error: error.message});
    }
}


// Metodo para eliminar un estudiante
const eliminarEstudiante = async (req, res) => {
    try {
        const { matricula } = req.params;

        const estudianteEliminado = await Estudiante.deleteOne({ Matricula: matricula });

        if(!estudianteEliminado){
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        return res.status(200).json({ message: "Estudiante eliminado exotosamente", estudiante: estudianteEliminado });
    } catch (error) {
        console.error("Error al eliminar estudiante:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });

    }
}

// Metodo para dar de baja temporalmente
const bajaTemporal = async (req, res) => {
    try {
        const { matricula } = req.params; // Obtener matrícula desde la URL

        const estudianteActualizado = await Estudiante.findOneAndUpdate(
            { Matricula: matricula }, // Buscar por matrícula
            { Estatus: "Inactivo" }, // Cambiar el estado a "Inactivo"
            { new: true } // Retornar el documento actualizado
        );

        if (!estudianteActualizado) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        return res.status(200).json({ message: "Estudiante dado de baja temporalmente", estudiante: estudianteActualizado });
    } catch (error) {
        console.error("Error al dar de baja temporal al estudiante:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Metodo para actualizar datos de un estudiante
// AUN NO ESTA PROBADO ESTE METODO
const updateEstudiante = async (req, res) => {
    try {
        const {  
            Nombre,
            ApellidoPaterno,
            ApellidoMaterno,
            Telefonos,
            CorreosElectronicos,
            Foto,
            Domicilio,
            CertificadoBachillerato, 
            Matricula,
            Tutor } = req.params;

        const estudianteActualizado = await Estudiante.findOneAndUpdate(
            { Matricula: Matricula }, // Buscar por matrícula
            { 
                Nombre: Nombre,
                ApellidoPaterno: ApellidoPaterno,
                ApellidoMaterno: ApellidoMaterno,
                Telefonos: Telefonos,
                CorreosElectronicos: CorreosElectronicos,
                Foro: Foto,
                Domicilio: Domicilio,  
                CartificadoBachillerato, CertificadoBachillerato,
                Tutor: Tutor
            }, 
            { new: true } // Retornar el documento actualizado
        );

        if (!estudianteActualizado) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        return res.status(200).json({ message: "Estudiante dado de baja temporalmente", estudiante: estudianteActualizado });

    } catch (error) {
        console.error("Error al actualizar estudiante");
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

module.exports = { crearEstudiante, getAllEstudiantes, eliminarEstudiante, getActiveEstudiantes, eliminarEstudiante, bajaTemporal, updateEstudiante};