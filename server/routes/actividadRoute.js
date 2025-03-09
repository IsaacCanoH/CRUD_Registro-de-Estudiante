const express = require("express");
const router = express.Router();
const ActividadExtracurricular = require("../controllers/actividadExtracurricularController");
const { upload, uploadExcel } = require("../controllers/actividadExtracurricularController");

router.post("/crear-actividad", ActividadExtracurricular.crearActividadExtracurricular);
router.get("/obtener-docente", ActividadExtracurricular.obtenerDocentes);
router.get("/obtener-actividades", ActividadExtracurricular.obtenerActividadesExtracurriculares);

router.post("/upload", upload.single("file"), uploadExcel);

module.exports = router;