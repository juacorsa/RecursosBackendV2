const express = require('express');
const { check } = require('express-validator/check');

const router = express.Router();

const temasController = require('../controllers/temas');
const Mensaje = require('../mensaje');

router.get('/', temasController.obtenerTemas);

router.get('/:id', temasController.obtenerTema);

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
	temasController.registrarTema
);

router.put(
	'/:id', 
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
	temasController.actualizarTema
);

module.exports = router;