const { Model, model } = require("mongoose");
const Estudiante = require("../models/Estudiante");

const crearEstudiante = async(req, res) => {
    try {
        const estudiante = new Estudiante(req.body);
        await estudiante.save();
        res.status(200).json({ mensaje: "Estudiante creado correctamente", estudiante});
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear un estudiante ", error});
    }
}

module.exports = {
    crearEstudiante
}