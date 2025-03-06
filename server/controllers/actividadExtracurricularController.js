const { Model, model } = require("mongoose");
const ActividadExtracurricular = require("../models/ActividadExtracurricular");
const Docente = require("../models/Docente");
const ActividadesExtracurriculares = require("../models/ActividadesExtracurriculares");

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

module.exports = {
    crearActividadExtracurricular,
    obtenerDocentes, 
    obtenerActividadesExtracurriculares
}