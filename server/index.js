const {conexion} = require("./database/connection");
const express = require("express");
const cors = require("cors");
const puerto = 3900

console.log("App arrancada!!!");
conexion();
const app = express();
app.use(cors());
app.use(express.json());

const rutasEstudiante = require("./routes/estudianteRoute");

app.use("/api/estudiante", rutasEstudiante);

app.listen(puerto,() => {
    console.log("Servidor corriendo en el puerto", puerto)
});
