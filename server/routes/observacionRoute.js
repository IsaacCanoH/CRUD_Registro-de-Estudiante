const express = require("express");
const router = express.Router();
const ObservacionDocente = require("../controllers/observacionDocenteController");
const { upload, uploadExcel } = require("../controllers/observacionDocenteController");

router.post("/crear-observacion", ObservacionDocente.crearObservacion);
router.get("/obtener-docentes", ObservacionDocente.obtenerDocentes);

router.post("/upload", upload.single("file"), uploadExcel);
router.get("/generar-plantilla", ObservacionDocente.generarExcelPlantilla);


module.exports = router;