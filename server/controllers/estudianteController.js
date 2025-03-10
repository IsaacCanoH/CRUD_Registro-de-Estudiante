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
exports.crearEstudiante = async (req, res) => {
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
exports.getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find();
        return res.status(200).json(estudiantes);
    } catch (error){
        console.error("Error al obtener estudiantes:", error);
        return res.status(500).json({message: "Error interno del servidor",error: error.message});
    }
}

// Metodo para eliminar un estudiante
exports.eliminarEstudiante = async (req, res) => {
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
exports.bajaTemporal = async (req, res) => {
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
exports.updateEstudiante = async (req, res) => {
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

// Método para buscar un estudiante por matrícula
exports.buscarPorMatricula = async (req, res) => {
    try {
        const { matricula } = req.params;
        const estudiante = await Estudiante.findOne({ Matricula: matricula });

        if (!estudiante) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        return res.status(200).json(estudiante);
    } catch (error) {
        console.error("Error al buscar estudiante por matrícula:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Método para buscar estudiantes por nombre o apellidos
exports.buscarPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un nombre o apellido para buscar." });
        }

        // Expresión regular para búsqueda insensible a mayúsculas y minúsculas
        const regex = new RegExp(nombre, "i");

        const estudiantes = await Estudiante.find({
            $or: [
                { Nombre: regex },
                { ApellidoPaterno: regex },
                { ApellidoMaterno: regex }
            ]
        });

        if (estudiantes.length === 0) {
            return res.status(404).json({ message: "No se encontraron estudiantes con ese nombre o apellido." });
        }

        return res.status(200).json(estudiantes);
    } catch (error) {
        console.error("Error al buscar estudiantes por nombre:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Metodo para filtrar por semestre
exports.filtroPorSemestre= async (req, res) => {
    try {
        const { semestre } = req.params;

        if (!semestre) {
            return res.status(400).json({ message: "Proporcione un semestre para filtrar estudiantes" });
        }

        const estudiantes = await Estudiante.find({ Semestre: semestre});

        if (estudiantes.length == 0) {
            return res.status(404).json({ message: "No se encontraron estudiates en este semestre" });
        }

        return res.status(200).json(estudiantes);
    } catch (error){
        console.log("Error al filtrar por semestre")
        return res.status(500).json({ message: "Error al filtrar por semestre", error: error.message });
    }
}

// Metodo para filtrar por año
exports.filtroPorAnio = async (req, res) => {
    try {
        const { anio } = req.params;

        if (!anio) {
            return res.status(400).json({ message: "Proporcione un año para filtrar estudiantes" });
        }

        const estudiantes = await Estudiante.find({ Año: anio });

        if (estudiantes.length == 0) {
            return res.status(404).json({ message: "No se encontraron estudiates en este año" });
        }

        return res.status(200).json(estudiantes);
    } catch (error){
        console.log("Error al filtrar por año")
        return res.status(500).json({ message: "Error al filtrar por año", error: error.message });
    }
}

// Metodo para filtrar por estatus
exports.filtroPorEstatus = async (req, res) => {
    try {
        const { estatus } = req.params;

        if (!estatus) {
            return res.status(400).json({ message: "Proporcione un estatus para filtrar estudiantes" });
        }

        const estudiantes = await Estudiante.find({ Estatus: estatus });

        if (estudiantes.length == 0) {
            return res.status(404).json({ message: "No se encontraron estudiates con este estatus" });
        }
        return res.status(200).json(estudiantes);
    } catch (error){
        return res.status(500).json({message: "Error al filtrar por estatus",error: error.message});
    }
}

 exports.filtroPorCarrera = async (req, res) => {
    try {
        const { carrera } = req.params;

        if (!carrera) {
            return res.status(400).json({ mesage: "Proporcione una carrera para filtrar estudiantes" })
        }

        // Decodificar espacios y caracteres especiales
        carrera = decodeURIComponent(carrera);

        const estudiantes = await Estudiante.find({ Carrera: carrera });

        if (estudiantes.length == 0) {
            return res.status(404).json({ mesage: "No se encontraron estudiantes en esta carrera" })
        }

        return res.estatus(200).json(estudiantes);
    } catch (error) {
        return res.status(500).json({ message: "Error al filtrar por carrera", error: error.message });
    }
}