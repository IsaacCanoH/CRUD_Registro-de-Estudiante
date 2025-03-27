const { Model, model } = require("mongoose");
const Estudiante = require("../models/Estudiante");
const Actividades = require("../models/ActividadExtracurricular");
const Observaciones = require("../models/ObservacionDocente");
const Carrera = require("../models/Carrera");
const Ciudad = require("../models/Ciudad")
const EspecialidadBachilerrato = require("../models/EspecialidadBachillerato");
const Contador = require('../models/Contador');
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'universidadindependencia@gmail.com', 
        pass: 'aygy fuex fyky ttwa' 
    }
});

const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");

const quitarAcentos = (str) => {
    if (!str) {
      return ''; 
    }
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
    const anio = fecha.getFullYear().toString().slice(-2);
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${primerasDosApellidoPaterno}${primeraApellidoMaterno}${primeraLetraNombre}${anio}${mes}${dia}`;
};

exports.generarMatricula = async (apellidoPaterno) => {
    try {
      // Obtener los últimos 2 dígitos del año actual
      const year = new Date().getFullYear().toString().slice(-2);
      
      // Determinar el semestre (1 = enero-junio, 2 = julio-diciembre)
      const month = new Date().getMonth() + 1;
      const semestre = month <= 6 ? '1' : '2';
  
      if (!apellidoPaterno || typeof apellidoPaterno !== 'string' || apellidoPaterno.length === 0) {
        throw new Error("El apellido paterno es requerido y debe ser una cadena no vacía.");
      }
      // Obtener la primera letra del apellido paterno en mayúscula
      const letraApellido = apellidoPaterno.charAt(0).toUpperCase();
  
      // Obtener el número consecutivo autoincremental
      let contador = await Contador.findOneAndUpdate(
        { nombre: 'matricula' }, // Buscamos el contador por nombre
        { $inc: { valor: 1 } }, // Incrementamos el valor en 1
        { new: true, upsert: true } // Si no existe, lo crea con el valor 1
      );
  
      // Formatear el número consecutivo a 4 dígitos
      const numeroConsecutivo = contador.valor.toString().padStart(4, '0');
  
      // Construir la matrícula
      const matricula = `${year}${semestre}${letraApellido}${numeroConsecutivo}`;
  
      return matricula; // Retornamos la matrícula generada
    } catch (error) {
      console.error("Error al generar la matrícula:", error);
      throw new Error("No se pudo generar la matrícula.");
    }
  };

// Metodo para crear estudiante
exports.crearEstudiante = async (req, res) => {
    try {
        const datosEstudiante = JSON.parse (req.body.estudiante);
        const ApellidoPaterno = datosEstudiante.ApellidoPaterno;
        // Generar la matrículaApelleidoPaterno automáticamente
        const matricula = await exports.generarMatricula(ApellidoPaterno);
        // Generar y validar RFC
        const rfcGenerado = generarRFC(datosEstudiante.Nombre, datosEstudiante.ApellidoPaterno, datosEstudiante.ApellidoMaterno, datosEstudiante.FechaNacimiento);
        if (!rfcGenerado) {
            return res.status(400).json({ message: "Error al generar el RFC." });
        }

        const existeRFC = await Estudiante.findOne({ RFC: rfcGenerado });
        if (existeRFC) {
            return res.status(400).json({ message: "El estudiante ya está registrado con este RFC." });
        }

        const fotoRuta = req.file ? req.file.path : "";

        // Crear y guardar estudiante
        const nuevoEstudiante = new Estudiante({ ...datosEstudiante, Matricula: matricula, RFC: rfcGenerado, Foto: fotoRuta });
        await nuevoEstudiante.save();

        const mailOptions = {
            from: 'universidadindependencia@gmail.com',
            to: datosEstudiante.CorreosElectronicos[0],
            subject: 'Bienvenido Estudiante - Universidad Independencia',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color:rgb(6, 110, 214); color: white; text-align: center; padding: 15px; font-size: 20px; font-weight: bold;">
                        Universidad Independencia
                    </div>
                    
                    <div style="padding: 20px; text-align: center;">
                        <p style="font-size: 18px; color: #003366;">Hola <strong>${datosEstudiante.Nombre} ${datosEstudiante.ApellidoPaterno} ${datosEstudiante.ApellidoMaterno}</strong></p>
                        <p style="font-size: 16px; color: #333;">Tu alta como estudiante ha sido exitosa. Bienvenido a nuestra institución.</p>
                        <p style="font-size: 14px; color: #555; font-style: italic;">"Formando líderes para el futuro"</p>
                    </div>

                    <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                        &copy; 2024 Universidad Independencia. Todos los derechos reservados.
                    </div>
                </div>
            `
        };
        

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error al enviar el correo:", error);
            } else {
                console.log("Correo enviado:", info.response);
            }
        });

        return res.status(201).json({ message: "Estudiante registrado exitosamente", estudiante: nuevoEstudiante });

    } catch (error) {
        console.error("Error al registrar estudiante:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "imagenes/"); 
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const nombreArchivo = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, nombreArchivo);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes"), false);
    }
};

exports.uploadImagen = multer({ storage: storageImage, fileFilter: fileFilter });


// Configuración de Multer para almacenar el archivo en memoria
const storage = multer.memoryStorage();
exports.upload = multer({ storage: storage });

exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Por favor sube un archivo Excel" });
        }

        console.log("Archivo recibido:", req.file.originalname);

        // Leer el archivo Excel
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir el contenido a JSON
        const data = xlsx.utils.sheet_to_json(sheet);
        console.log("Datos procesados del Excel:", data);

        if (data.length === 0) {
            return res.status(400).json({ message: "El archivo Excel está vacío o tiene un formato incorrecto" });
        }

        const estudiantes = [];

        for (const row of data) {
            const fechaNacimiento = row.FechaNacimiento
                ? new Date((row.FechaNacimiento - 25569) * 86400000)
                : null;

            const estudiante = {
                Nombre: row.Nombre,
                ApellidoPaterno: row.ApellidoPaterno,
                ApellidoMaterno: row.ApellidoMaterno,
                FechaNacimiento: fechaNacimiento,
                Sexo: row.Sexo,
                Telefonos: row.Teléfonos ? String(row.Teléfonos) : "",
                CorreosElectronicos: row.CorreosElectrónicos
                    ? String(row.CorreosElectrónicos).split(",").map(email => email.trim())
                    : [],
                Semestre: row.Semestre,
                Anio: row["Año"],
                Domicilio: {
                    Calle: row["Domicilio.Calle"],
                    NumeroInterior: row["Domicilio.NumeroInterior"],
                    NumeroExterior: row["Domicilio.NumeroExterior"],
                    Colonia: row["Domicilio.Colonia"],
                    CodigoPostal: row["Domicilio.CodigoPostal"],
                    Ciudad: row["Domicilio.Ciudad"]
                },
                PromedioBachillerato: row.PromedioBachillerato,
                EspecialidadBachillerato: row.EspecialidadBachillerato,
                CertificadoBachillerato: row.CertificadoBachillerato,
                NombreCarrera: row.NombreCarrera,
                Especialidad: row.Especialidad,
                Tutor: {
                    Nombre: row["Tutor.Nombre"],
                    ApellidoPaterno: row["Tutor.ApellidoPaterno"],
                    ApellidoMaterno: row["Tutor.ApellidoMaterno"],
                    Telefonos: row["Tutor.Teléfonos"] ? String(row["Tutor.Teléfonos"]) : "",
                    CorreosElectronicos: row["Tutor.CorreosElectrónicos"]
                        ? String(row["Tutor.CorreosElectrónicos"]).split(",").map(email => email.trim())
                        : [],
                    Domicilio: {
                        Calle: row["Tutor.Domicilio.Calle"],
                        NumeroInterior: row["Tutor.Domicilio.NumeroInterior"],
                        NumeroExterior: row["Tutor.Domicilio.NumeroExterior"],
                        Colonia: row["Tutor.Domicilio.Colonia"],
                        CodigoPostal: row["Tutor.Domicilio.CodigoPostal"],
                        Ciudad: row["Tutor.Domicilio.Ciudad"]
                    }
                }
            };

            estudiante.Matricula = await exports.generarMatricula(estudiante.ApellidoPaterno);
            estudiante.RFC = generarRFC(estudiante.Nombre, estudiante.ApellidoPaterno, estudiante.ApellidoMaterno, estudiante.FechaNacimiento);

            const existeRFC = await Estudiante.findOne({ RFC: estudiante.RFC });
            if (existeRFC) {
                console.error(`El estudiante con RFC ${estudiante.RFC} ya está registrado.`);
                continue; 
            }

            estudiantes.push(estudiante);
        }

        await Estudiante.insertMany(estudiantes);

        // Enviar correos electrónicos a los estudiantes
        for (const estudiante of estudiantes) {
            if (estudiante.CorreosElectronicos.length > 0) {
                const mailOptions = {
                    from: 'universidadindependencia@gmail.com',
                    to: estudiante.CorreosElectronicos[0],
                    subject: 'Bienvenido Estudiante - Universidad Independencia',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                            <div style="background-color:rgb(6, 110, 214); color: white; text-align: center; padding: 15px; font-size: 20px; font-weight: bold;">
                                Universidad Independencia
                            </div>
                            
                            <div style="padding: 20px; text-align: center;">
                                <p style="font-size: 18px; color: #003366;">Hola <strong>${estudiante.Nombre} ${estudiante.ApellidoPaterno} ${estudiante.ApellidoMaterno}</strong></p>
                                <p style="font-size: 16px; color: #333;">Tu alta como estudiante ha sido exitosa. Bienvenido a nuestra institución.</p>
                                <p style="font-size: 14px; color: #555; font-style: italic;">"Formando líderes para el futuro"</p>
                            </div>

                            <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                                &copy; 2024 Universidad Independencia. Todos los derechos reservados.
                            </div>
                        </div>
                    `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`Error al enviar correo a ${estudiante.Nombre}:`, error);
                    } else {
                        console.log(`Correo enviado a ${estudiante.Nombre}:`, info.response);
                    }
                });
            }
        }

        return res.status(200).json({ message: "Datos importados correctamente" });

    } catch (error) {
        console.error("Error al procesar el archivo:", error);
        return res.status(500).json({ message: "Error al procesar el archivo", error: error.message });
    }
};

// Metodo para generar platilla de excel
exports.descargarPlantillaExcel = (req, res) => {
    try {
      // Define las columnas y una fila de ejemplo vacía (opcional)
      const headers = [{
        Matrícula: '',
        Nombre: '',
        ApellidoPaterno: '',
        ApellidoMaterno: '',
        FechaNacimiento: 'dd/mm/yyyy',
        Sexo: '',
        Teléfonos: 'Ej: 4151234567, 4189876543',
        CorreosElectrónicos: 'Ej: ejemplo@correo.com, otro@correo.com',
        RFC: '',
        Semestre: '',
        Año: '',
        'Domicilio.Calle': '',
        'Domicilio.NumeroInterior': '',
        'Domicilio.NumeroExterior': '',
        'Domicilio.Colonia': '',
        'Domicilio.CodigoPostal': '',
        'Domicilio.Ciudad': '',
        PromedioBachillerato: '',
        EspecialidadBachillerato: '',
        CertificadoBachillerato: '',
        NombreCarrera: '',
        Especialidad: '',
        'Tutor.Nombre': '',
        'Tutor.ApellidoPaterno': '',
        'Tutor.ApellidoMaterno': '',
        'Tutor.Teléfonos': 'Ej: 4151234567, 4189876543',
        'Tutor.CorreosElectrónicos': 'Ej: tutor@correo.com, otro@correo.com',
        'Tutor.Domicilio.Calle': '',
        'Tutor.Domicilio.NumeroInterior': '',
        'Tutor.Domicilio.NumeroExterior': '',
        'Tutor.Domicilio.Colonia': '',
        'Tutor.Domicilio.CodigoPostal': '',
        'Tutor.Domicilio.Ciudad': ''
      }];
  
      // Crea hoja y libro
      const worksheet = xlsx.utils.json_to_sheet(headers);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Plantilla');
  
      // Envía el archivo como descarga
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
      res.setHeader('Content-Disposition', 'attachment; filename=Plantilla_Estudiantes.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      return res.send(buffer);
    } catch (error) {
      console.error('Error al generar plantilla:', error);
      return res.status(500).json({ message: 'Error al generar la plantilla' });
    }
  };
  

// Metodo para visualizar todos los estudiantes
exports.getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find();
        return res.status(200).json(estudiantes);
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

// Metodo para eliminar un estudiante
exports.eliminarEstudiante = async (req, res) => {
    try {
        const { matricula } = req.params;

        const estudianteEliminado = await Estudiante.deleteOne({ Matricula: matricula });

        if (!estudianteEliminado) {
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
const fs = require("fs");
const EspecialidadBachillerato = require("../models/EspecialidadBachillerato");

exports.updateEstudiante = async (req, res) => {
    try {
        const { matricula } = req.params;
        const datosActualizados = { ...req.body };

        const estudiante = await Estudiante.findOne({ Matricula: matricula });
        if (!estudiante) return res.status(404).json({ message: "Estudiante no encontrado" });

        // Si hay un nuevo archivo de imagen, manejar la actualización de la foto
        if (req.file) {
            // Eliminar la foto anterior si existe
            if (estudiante.Foto) {
                fs.unlink(estudiante.Foto, (err) => {
                    if (err) console.error("Error al eliminar imagen:", err);
                });
            }
            // Guardar la nueva foto
            datosActualizados.Foto = req.file.path;
        }

        // Actualizar los datos del estudiante
        const estudianteActualizado = await Estudiante.findOneAndUpdate(
            { Matricula: matricula },
            datosActualizados,
            { new: true }
        );

        return res.status(200).json({ message: "Estudiante actualizado", estudiante: estudianteActualizado });

    } catch (error) {
        console.error("Error al actualizar estudiante:", error);
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
exports.filtroPorSemestre = async (req, res) => {
    try {
        const { semestre } = req.params;

        if (!semestre) {
            return res.status(400).json({ message: "Proporcione un semestre para filtrar estudiantes" });
        }

        const estudiantes = await Estudiante.find({ Semestre: semestre });

        if (estudiantes.length == 0) {
            return res.status(404).json({ message: "No se encontraron estudiates en este semestre" });
        }

        return res.status(200).json(estudiantes);
    } catch (error) {
        console.log("Error al filtrar por semestre")
        return res.status(500).json({ message: "Error al filtrar por semestre", error: error.message });
    }
};

// Metodo para filtrar por año
exports.filtroPorAnio = async (req, res) => {
    try {
        const { anio } = req.params;

        if (!anio) {
            return res.status(400).json({ message: "Proporcione un año para filtrar estudiantes" });
        }

        const estudiantes = await Estudiante.find({ Anio: anio });

        if (estudiantes.length == 0) {
            return res.status(404).json({ message: "No se encontraron estudiates en este año" });
        }

        return res.status(200).json(estudiantes);
    } catch (error) {
        console.log("Error al filtrar por año")
        return res.status(500).json({ message: "Error al filtrar por año", error: error.message });
    }
};

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
    } catch (error) {
        return res.status(500).json({ message: "Error al filtrar por estatus", error: error.message });
    }
};

exports.filtroPorCarrera = async (req, res) => {
    try {
        let { carrera } = req.params;

        if (!carrera) {
            return res.status(400).json({ mesage: "Proporcione una carrera para filtrar estudiantes" })
        }

        // Decodificar espacios y caracteres especiales
        carrera = decodeURIComponent(carrera);

        const estudiantes = await Estudiante.find({ NombreCarrera: carrera });

        if (estudiantes.length == 0) {
            return res.status(404).json({ mesage: "No se encontraron estudiantes en esta carrera" })
        }

        return res.status(200).json(estudiantes);
    } catch (error) {
        return res.status(500).json({ message: "Error al filtrar por carrera", error: error.message });
    }
};

exports.filtroPorEspecialidad = async (req, res) => {
    try {
        const { especialidad } = req.params;

        if (!especialidad) {
            return res.status(400).json({ mesage: "Proporcione una carrera para filtrar estudiantes" })
        }

        // Decodificar espacios y caracteres especiales
        carrera = decodeURIComponent(especialidad);

        const estudiantes = await Estudiante.find({ Especialidad: especialidad });

        if (estudiantes.length == 0) {
            return res.status(404).json({ mesage: "No se encontraron estudiantes en esta carrera" })
        }

        return res.status(200).json(estudiantes);
    } catch (error) {
        return res.status(500).json({ message: "Error al filtrar por carrera", error: error.message });
    }
};

exports.perfilPorMatricula = async (req, res) => {
    try {
        const { matricula } = req.params;
        const estudiante = await Estudiante.findOne({ Matricula: matricula });
        const actividades = await Actividades.find({ MatriculaAlumno: matricula });
        const observaciones = await Observaciones.find({ MatriculaAlumno: matricula });


        if (!estudiante) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        if (estudiante.Estatus === 'Inactivo') {
            return res.status(400).json({ message: "El estudiante está inactivo. No se pueden mostrar los datos." });
        }

        if (!actividades) {
            res.status(404).json({ message: "No hay actividades extracurriculares" });
        }

        if (!observaciones) {
            res.status(404).json({ message: "No hay observaciones docentes" });
            console.log("No hay observaciones");
        }

        return res.status(200).json({ estudiante, actividades, observaciones });
    } catch (error) {
        console.error("Error al buscar estudiante por matrícula:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

exports.getCatalogoCarreras = async (req, res) => {
    try {
      const catalogo = await Carrera.find();
      res.status(200).json(catalogo);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener catálogo Carrera", error: error.message });
    }
  };

exports.getCatalogoCiudad = async (req, res) => {
    try {
        const catalogo = await Ciudad.find();
        res.status(200).json(catalogo);
    } catch (error){
        res.status(500).json({ message: "Error al obtener catálogo Ciudad", error: error.message });
    }
}

exports.getCatalogoEspecialidadBachillerato = async (req, res) => {
    try {
        const catalogo = await EspecialidadBachilerrato.find();
        res.status(200).json(catalogo);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener catálogo EspecialidadBachilerrato", error: error.message });
    }
}

exports.getContadorMatricula = async (req, res) => {
    try {
        const contador = await Contador.find({},{valor:1});
        res.status(200).json(contador);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el contador de matriculas", error: error.message });
    }
}

exports.reactivarEstudiante = async (req, res) => {
    try {
        const matricula = req.params;
        const estudiante = await Estudiante.findOne( matricula );
        if (!estudiante) return res.status(404).json({ message: "Estudiante no encontrado" });
        

        if(estudiante.Estatus == "Activo"){
            return res.status(400).json({ message: "El estudiante ya esta activo."});
        }
        const estudianteActualizado = await Estudiante.findOneAndUpdate(
            matricula,
            { Estatus: "Activo"},
            { new: true }
        );
        
        res.status(200).json(estudianteActualizado);
    } catch(error) {
        return res.status(500).json({ message: "Error al reactivar al usuario", error: error.message });
    }
}

exports.getEstatus = async (req, res) => {
    try {
        const matricula = req.params;

        const estatus = await Estudiante.findOne( matricula, {_id:0,Estatus:1});
        
        console.log(estatus);
        res.status(200).json(estatus);
    } catch(error) {
        return res.status(500).json({ message: "Error al reactivar al usuario", error: error.message });
    }

}