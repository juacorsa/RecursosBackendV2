const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const idiomasController = require('../controllers/idiomas');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', idiomasController.obtenerIdiomas);

router.get('/:id', validateId, idiomasController.obtenerIdioma);

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
	idiomasController.registrarIdioma
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
	idiomasController.actualizarIdioma
);

module.exports = router;