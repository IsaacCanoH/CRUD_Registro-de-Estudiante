const express = require("express");
const router = express.Router();
const ObservacionDocente = require("../controllers/observacionDocenteController");

router.post("/crear-observacion", ObservacionDocente.crearObservacion);
router.get("/obtener-docentes", ObservacionDocente.obtenerDocentes);

module.exports = router;