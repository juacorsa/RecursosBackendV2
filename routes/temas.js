const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const temasController = require('../controllers/temas');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', temasController.obtenerTemas);

router.get('/:id', validateId, temasController.obtenerTema);

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
	temasController.actualizarTema
);

module.exports = router;