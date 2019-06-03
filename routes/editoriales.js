const express = require('express');
const router = express.Router();
const editorialesController = require('../controllers/editoriales');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', editorialesController.obtenerEditoriales);

router.get('/:id', validateId, editorialesController.obtenerEditorial);

router.post('/', editorialesController.registrarEditorial);

router.put('/:id', validateId, editorialesController.actualizarEditorial);

module.exports = router;