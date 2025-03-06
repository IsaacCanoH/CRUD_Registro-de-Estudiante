const { Model, model} = require("mongoose");
const ObservacionDocente = require("../models/ObservacionDocente");
const Docente = require("../models/Docente");

const crearObservacion = async(req,res) => {
    try {
        const observacion = new ObservacionDocente(req.body);
        await observacion.save();
        res.status(200).json({ mensaje: "Observacion creada correctamente ", observacion});
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear observacion", error})
    }
}

const obtenerDocentes = async(req,res) => {
    try {
        const docentes = await Docente.find();
        res.status(200).json(docentes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener docentes"});
    }
}

module.exports = {
    crearObservacion,
    obtenerDocentes
}