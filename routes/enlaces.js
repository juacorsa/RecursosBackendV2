const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlaces');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', enlacesController.obtenerEnlaces);

router.get('/:id', validateId, enlacesController.obtenerEnlace);

router.get('/tema/:id', validateId, enlacesController.obtenerEnlacesPorTema);

router.post('/', enlacesController.registrarEnlace);

router.put('/:id', enlacesController.actualizarEnlace);

router.delete('/:id', validateId, enlacesController.borrarEnlace);

module.exports = router;
