const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const librosController = require('../controllers/libros');
const validateId = require('../middlewares/validateId');
const Mensaje = require('../mensaje');
const Util = require('../util');

const añoActual = Util.getYear();
const añoDesde  = 2000;
const paginasMinimo = 0;

router.get('/', librosController.obtenerLibros);

router.get('/:id', validateId, librosController.obtenerLibro);

router.post('/', [
		check('titulo').trim().not().isEmpty().withMessage(Mensaje.TITULO_REQUERIDO),
		check('paginas').trim().not().isEmpty().withMessage(Mensaje.PAGINAS_NO_VALIDO),
		check('paginas').isInt({gt: paginasMinimo}).withMessage(Mensaje.PAGINAS_NO_VALIDO),
		check('publicado').trim().not().isEmpty().withMessage(Mensaje.AÑO_PUBLICACION_NO_VALIDO),
		check('publicado').isInt({gt: añoDesde, lt: añoActual}).withMessage(Mensaje.AÑO_PUBLICACION_NO_VALIDO)
	], 
	librosController.registrarLibro
);

router.put('/:id', validateId, [
		check('titulo').trim().not().isEmpty().withMessage(Mensaje.TITULO_REQUERIDO),
		check('paginas').trim().not().isEmpty().withMessage(Mensaje.PAGINAS_NO_VALIDO),
		check('paginas').isInt({gt: paginasMinimo}).withMessage(Mensaje.PAGINAS_NO_VALIDO),
		check('publicado').trim().not().isEmpty().withMessage(Mensaje.AÑO_PUBLICACION_NO_VALIDO),
		check('publicado').isInt({gt: añoDesde, lt: añoActual}).withMessage(Mensaje.AÑO_PUBLICACION_NO_VALIDO)
	], 
	librosController.actualizarLibro
);

router.delete('/:id', validateId, librosController.borrarLibro);

module.exports = router;