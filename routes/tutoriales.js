const express = require('express');
const router = express.Router();
const tutorialesController = require('../controllers/tutoriales');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', tutorialesController.obtenerTutoriales);

router.get('/:id', validateId, tutorialesController.obtenerTutorial);

router.post('/', tutorialesController.registrarTutorial);

router.put('/:id', tutorialesController.actualizarTutorial);

router.delete('/:id', validateId, tutorialesController.borrarTutorial);

module.exports = router;
