const express = require('express');
const router = express.Router();
const fabricantesController = require('../controllers/fabricantes');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', fabricantesController.obtenerFabricantes);

router.get('/:id', validateId, fabricantesController.obtenerFabricante);

router.post('/', fabricantesController.registrarFabricante);

router.put('/:id', validateId,fabricantesController.actualizarFabricante);

module.exports = router;