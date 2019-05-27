const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const tutorialesController = require('../controllers/tutoriales');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');
const Util = require('../util');

const añoActual = Util.getYear();
const añoDesde  = 2010;
const duracionMinima = 1;

router.get('/', tutorialesController.obtenerTutoriales);

router.get('/:id', validateId, tutorialesController.obtenerTutorial);

router.post('/', [
		check('titulo').trim().not().isEmpty().withMessage(Mensaje.TITULO_REQUERIDO),
		check('duracion').trim().not().isEmpty().withMessage(Mensaje.DURACION_NO_VALIDA),
		check('duracion').isInt({min: duracionMinima}).withMessage(Mensaje.DURACION_NO_VALIDA),
		check('publicado').trim().not().isEmpty().withMessage(Mensaje.AÑO_PUBLICACION_NO_VALIDO),
		check('publicado').isInt({min: añoDesde, max: añoActual}).withMessage(Mensaje.AÑO_PUBLICACION_NO_VALIDO)
	], 
	tutorialesController.registrarTutorial
);

router.put('/:id', [
		check('titulo').trim().not().isEmpty().withMessage(Mensaje.TITULO_REQUERIDO),
		check('duracion').trim().not().isEmpty().withMessage(Mensaje.DURACION_NO_VALIDA),
		check('duracion').isInt({min: duracionMinima}).withMessage(Mensaje.DURACION_NO_VALIDA),
		check('publicado').trim().not().isEmpty().withMessage(Mensaje.AÑO_PUBLICACION_NO_VALIDO),
		check('publicado').isInt({min: añoDesde, max: añoActual}).withMessage(Mensaje.AÑO_PUBLICACION_NO_VALIDO)
	], 
	tutorialesController.actualizarTutorial
);

router.delete('/:id', validateId, tutorialesController.borrarTutorial);

module.exports = router;
