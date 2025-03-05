const express = require("express");
const router = express.Router();
const estudianteController = require("../controllers/estudianteController");

router.post("/crearEstudiante", estudianteController.crearEstudiante);
router.get("/getAllEstudiantes", estudianteController.getAllEstudiantes);
router.get("/getActiveEstudiantes", estudianteController.getActiveEstudiantes);
router.delete("/deleteEstudiante/:matricula", estudianteController.eliminarEstudiante);
router.put("/bajaTemporal/:matricula", estudianteController.bajaTemporal);
router.put("/updateEstudiante", estudianteController.updateEstudiante);




module.exports = router;