const express = require("express");
const router = express.Router();
const estudianteController = require("../controllers/estudianteController");
const { upload, uploadExcel } = require("../controllers/estudianteController");
const { uploadImagen } = require("../controllers/estudianteController")

router.post("/crearEstudiante",  uploadImagen.single("foto"),estudianteController.crearEstudiante);
router.post("/crearEstudianteMasiva", upload.single("file"), uploadExcel);
router.get("/getAllEstudiantes", estudianteController.getAllEstudiantes);
router.delete("/deleteEstudiante/:matricula", estudianteController.eliminarEstudiante);
router.patch("/bajaTemporal/:matricula", estudianteController.bajaTemporal);
router.put("/updateEstudiante/:matricula", uploadImagen.single("foto"), estudianteController.updateEstudiante);
router.get("/getPorMatricula/:matricula", estudianteController.buscarPorMatricula);
router.get("/getPorNombre/:nombre", estudianteController.buscarPorNombre);
router.get("/getPorSemestre/:semestre", estudianteController.filtroPorSemestre)
router.get("/getPorAnio/:anio", estudianteController.filtroPorAnio)
router.get("/getPorEstatus/:estatus", estudianteController.filtroPorEstatus);
router.get("/getPorCarrera/:carrera", estudianteController.filtroPorCarrera);
router.get("/getPorEspecialidad/:especialidad", estudianteController.filtroPorEspecialidad);
router.get("/perfil/:matricula", estudianteController.perfilPorMatricula);
router.get("/catalogoCarreras", estudianteController.getCatalogoCarreras);
router.get("/catalogoCiudades", estudianteController.getCatalogoCiudad);
router.get("/catalogoEspecialidadBachillerato", estudianteController.getCatalogoEspecialidadBachillerato);
router.get('/descargarPlantilla', estudianteController.descargarPlantillaExcel);
router.get('/generarMatricula', estudianteController.generarMatricula);
router.get('/getContadorMatricula', estudianteController.getContadorMatricula);
router.patch('/reactivarEstudiante/:Matricula', estudianteController.reactivarEstudiante);
router.get('/getEstatus/:Matricula', estudianteController.getEstatus);

module.exports = router;