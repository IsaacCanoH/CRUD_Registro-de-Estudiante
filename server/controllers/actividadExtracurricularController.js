const { Model, model } = require("mongoose");
const ActividadExtracurricular = require("../models/ActividadExtracurricular");
const Docente = require("../models/Docente");

const multer = require("multer");
const xlsx = require("xlsx");

const crearActividadExtracurricular = async(req,res) => {
    try {
        const actividad = new ActividadExtracurricular(req.body);
        await actividad.save();
        res.status(200).json({ mensaje: "Actividad creada correctamente", actividad });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear actividad", error });
    }
}

const obtenerDocentes = async(req,res) => {
    try {
        const docentes = await Docente.find();
        res.status(200).json(docentes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener docentes", error});
    }
}

const obtenerActividadesExtracurriculares = async(req,res) => {
    try {
        const actividades = await ActividadesExtracurriculares.find();
        res.status(200).json(actividades);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las actividades "});
    }
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

const uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Por favor sube un archivo Excel" });
        }

        // Leer el archivo Excel
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir el contenido a JSON
        const data = xlsx.utils.sheet_to_json(sheet);

        // Mapear datos y almacenarlos en MongoDB
        const actividades = data.map(row => ({
            Matricula: row.Matricula,
            NombreDocente: row.NombreDocente,
            NombreActividadExtracurricular: row.NombreActividadExtracurricular,
            FechaInicio: new Date(row.FechaInicio),
            FechaTermino: new Date(row.FechaTermino),
            Resultado: row.Resultado
        }));

        await ActividadExtracurricular.insertMany(actividades);
        res.status(200).json({ message: "Datos importados correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al procesar el archivo" });
    }
};

const generarExcelPlantilla = (req, res) => {
    try {
        // Definir los encabezados del archivo Excel
        const encabezados = [
            ["Matricula", "NombreDocente", "NombreActividadExtracurricular", "FechaInicio", "FechaTermino", "Resultado"]
        ];

        // Crear un nuevo libro de trabajo y una hoja
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet(encabezados);

        // Agregar la hoja al libro de trabajo
        xlsx.utils.book_append_sheet(workbook, worksheet, "Plantilla");

        // Escribir el archivo en un buffer
        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        // Configurar la respuesta HTTP para enviar el archivo
        res.setHeader("Content-Disposition", "attachment; filename=Plantilla_Actividades.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        res.send(buffer);
    } catch (error) {
        console.error("Error al generar la plantilla de Excel:", error);
        res.status(500).json({ mensaje: "Error al generar la plantilla de Excel" });
    }
};

module.exports = {
    crearActividadExtracurricular,
    obtenerDocentes, 
    obtenerActividadesExtracurriculares,
    uploadExcel,
    upload,
    generarExcelPlantilla
}