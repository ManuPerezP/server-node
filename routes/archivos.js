const express = require("express");
const router = express.Router();
const archivosController = require("../controllers/archivosController");
const auth = require("../middleware/auth");

router.post("/", auth, archivosController.subirArchivo);

//router.delete("/:id", archivosController.eliminarArchivo);
//esta en routing de enlaces

router.get('/:archivo',archivosController.descargar,
archivosController.eliminarArchivo);

module.exports = router;
