const express = require('express');
const router = express.Router();
const idiomasController = require('../controllers/idiomas');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', idiomasController.obtenerIdiomas);

router.get('/:id', validateId, idiomasController.obtenerIdioma);

router.post('/', idiomasController.registrarIdioma);

router.put('/:id', validateId, idiomasController.actualizarIdioma);

module.exports = router;