const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const editorialesController = require('../controllers/editoriales');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', editorialesController.obtenerEditoriales);

router.get('/:id', validateId, editorialesController.obtenerEditorial);

router.post(
	'/', 
	[
		check('nombre')
			.trim()
			.not()
			.isEmpty()
			.withMessage(Mensaje.NOMBRE_REQUERIDO),
		check('nombre')
			.trim()		
			.isLength({ min: 3 })
			.withMessage(Mensaje.NOMBRE_MIN_LENGTH_3)
	], 
	editorialesController.registrarEditorial
);

router.put(
	'/:id', 
	validateId,
	[
		check('nombre')
			.trim()
			.not()
			.isEmpty()
			.withMessage(Mensaje.NOMBRE_REQUERIDO),
		check('nombre')
			.trim()		
			.isLength({ min: 3 })
			.withMessage(Mensaje.NOMBRE_MIN_LENGTH_3)
	], 
	editorialesController.actualizarEditorial
);

module.exports = router;