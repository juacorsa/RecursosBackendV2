const express = require('express');
const router = express.Router();
const librosController = require('../controllers/libros');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', librosController.obtenerLibros);

router.get('/:id', validateId, librosController.obtenerLibro);

router.post('/', librosController.registrarLibro);

router.put('/:id', validateId, librosController.actualizarLibro);

router.delete('/:id', validateId, librosController.borrarLibro);

module.exports = router;