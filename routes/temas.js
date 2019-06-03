const express = require('express');
const router = express.Router();
const temasController = require('../controllers/temas');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', temasController.obtenerTemas);

router.get('/:id', validateId, temasController.obtenerTema);

router.post('/', temasController.registrarTema);

router.put('/:id', validateId, temasController.actualizarTema);

module.exports = router;