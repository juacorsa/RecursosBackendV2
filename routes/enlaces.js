const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const enlacesController = require('../controllers/enlaces');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');

router.get('/', enlacesController.obtenerEnlaces);

router.get('/:id', validateId, enlacesController.obtenerEnlace);

router.get('/tema/:id', validateId, enlacesController.obtenerEnlacesPorTema);

router.post('/', [
		check('titulo').trim().not().isEmpty().withMessage(Mensaje.TITULO_REQUERIDO),
		check('url').trim().not().isEmpty().withMessage(Mensaje.URL_REQUERIDA),
		check('url').isURL().withMessage(Mensaje.URL_FORMATO_INCORRECTO),
	], 
	enlacesController.registrarEnlace
);

router.put('/:id', [
		check('titulo').trim().not().isEmpty().withMessage(Mensaje.TITULO_REQUERIDO),
		check('url').trim().not().isEmpty().withMessage(Mensaje.URL_REQUERIDA),
		check('url').isURL().withMessage(Mensaje.URL_FORMATO_INCORRECTO),
	], 
	enlacesController.actualizarEnlace
);

router.delete('/:id', validateId, enlacesController.borrarEnlace);

module.exports = router;
