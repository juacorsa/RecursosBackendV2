const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const librosController = require('../controllers/libros');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');
const Util = require('../util');

const añoActual = Util.getYear();
const añoDesde  = 2000;
const paginasMinimo = 0;

router.get('/', librosController.obtenerLibros);

router.get('/:id', validateId, librosController.obtenerLibro);

router.post('/', librosController.registrarLibro);

router.put('/:id', validateId, librosController.actualizarLibro);

router.delete('/:id', validateId, librosController.borrarLibro);

module.exports = router;