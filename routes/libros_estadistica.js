const express = require('express');
const router = express.Router();

const librosEstadisticaController = require('../controllers/libros-estadistica');

router.get('/', librosEstadisticaController.obtenerEstadisticaLibros);

module.exports = router;