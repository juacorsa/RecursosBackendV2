const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const fabricantesController = require('../controllers/fabricantes');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', fabricantesController.obtenerFabricantes);

router.get('/:id', validateId, fabricantesController.obtenerFabricante);

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
	fabricantesController.registrarFabricante
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
	fabricantesController.actualizarFabricante
);

module.exports = router;