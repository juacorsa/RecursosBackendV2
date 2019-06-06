const express = require('express');
const router = express.Router();

const tutorialesEstadisticaController = require('../controllers/tutoriales_estadistica');

router.get('/', tutorialesEstadisticaController.obtenerEstadisticaTutoriales);

module.exports = router;