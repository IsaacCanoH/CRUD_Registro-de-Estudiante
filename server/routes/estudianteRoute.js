const express = require("express");
const router = express.Router();
const estudianteController = require("../controllers/estudianteController");

router.post("/crearEstudiante", estudianteController.crearEstudiante);
router.get("/getAllEstudiantes", estudianteController.getAllEstudiantes);
router.delete("/deleteEstudiante/:matricula", estudianteController.eliminarEstudiante);
router.put("/bajaTemporal/:matricula", estudianteController.bajaTemporal);
router.put("/updateEstudiante", estudianteController.updateEstudiante);
router.get("/getPorMatricula/:matricula", estudianteController.buscarPorMatricula);
router.get("/getPorNombre/:nombre", estudianteController.buscarPorNombre);
router.get("/getPorSemestre/:semestre", estudianteController.filtroPorSemestre)
router.get("/getPorAnio/:anio", estudianteController.filtroPorAnio)
router.get("/getPorEstatus/:estatus", estudianteController.filtroPorEstatus);
router.get("/getPorCarrera/:carrera", estudianteController.filtroPorCarrera);


module.exports = router;