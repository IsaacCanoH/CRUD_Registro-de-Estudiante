const {conexion} = require("./database/connection");
const express = require("express");
const cors = require("cors");
const puerto = 3900
const path = require("path")

console.log("App arrancada!!!");
conexion();
const app = express();
app.use(cors());
app.use(express.json());

const rutasEstudiante = require("./routes/estudianteRoute");
const rutasActividad = require("./routes/actividadRoute");
const rutasObservacion = require("./routes/observacionRoute");

app.use("/api/estudiante", rutasEstudiante);
app.use("/api/actividad", rutasActividad);
app.use("/api/observacion", rutasObservacion);
app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

app.listen(puerto,() => {
    console.log("Servidor corriendo en el puerto", puerto)
});
