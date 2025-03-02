const mongoose = require("mongoose");

const conexion = async() => {
    try {
        mongoose.connect("mongodb://localhost:27017/UniversidadIndependencia")
    } catch (error) {
        console.log(error);
        throw new Error("Conexión Fallida");
    }
}

module.exports = {
    conexion
}