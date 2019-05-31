const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');
const Joi = require('@hapi/joi');

const Tutorial = require('../models/tutorial');
const Mensaje = require('../mensaje');
const Util = require('../util');

const añoActual = Util.getYear();
const añoMinimo  = 2010;
const duracionMinima = 1;

exports.obtenerTutoriales = async (req, res, next) => { 
	const { desde, hasta, tema, idioma, fabricante, ordenar } = req.query;
	
	try {		
		let query = Tutorial
			.find()
			.populate('tema')
			.populate('fabricante')
			.populate('idioma');

		if (desde) query.where('publicado').gte(desde);		
		if (hasta) query.where('publicado').lte(hasta);
		if (tema) query.where('tema').equals(tema);
		if (idioma) query.where('idioma').equals(idioma);
		if (fabricante) query.where('fabricante').equals(fabricante);	
	
		if (ordenar) {
			const split = ordenar.split(':');					
			const ordenarPor = split[1].toLowerCase() === 'asc' ? split[0] : '-' + split[0];		
			query.sort(ordenarPor);
		} else {
			query.sort('titulo');
		}
	
		const tutoriales = await query.exec();
		const total_tutoriales = tutoriales.length;	
		let total_duracion = 0;			
		Object.keys(tutoriales).forEach(i => total_duracion += tutoriales[i].duracion);

		res.status(HttpStatus.OK).json({tutoriales, total_tutoriales, total_duracion});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

exports.obtenerTutorial = async (req, res, next) => { 	
	const { id } = req.params;
	const tutorial = await Tutorial.findById(id);
	
	try {
		if (!tutorial) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.TUTORIAL_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({tutorial});

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};

exports.registrarTutorial =  async (req, res, next) => { 
	const input = {
		titulo    : req.body.titulo,
		duracion  : req.body.duracion,
		publicado : req.body.publicado,
		tema	  : req.body.tema,
		fabricante: req.body.fabricante,
		idioma    : req.body.idioma
	}	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }
	  
	  const { titulo, duracion, publicado, observaciones, tema, fabricante, idioma } = req.body;
	  const tutorial = new Tutorial({titulo, duracion, publicado, observaciones, tema, fabricante, idioma});

	  try {
		await tutorial.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.TUTORIAL_REGISTRADO, tutorial });	

		} catch(err) {
			err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
	    	next(err);
	  	}
	  });		
};

exports.actualizarTutorial = async (req, res, next) => {
	const input = {
		titulo    : req.body.titulo,
		duracion  : req.body.duracion,
		publicado : req.body.publicado,
		tema	  : req.body.tema,
		fabricante: req.body.fabricante,
		idioma    : req.body.idioma
	}	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }

  	  const { id } = req.params;
  	  const { titulo, duracion, publicado, observaciones, tema, fabricante, idioma } = req.body;

  	  try {
	  	const tutorial = await Tutorial.findByIdAndUpdate(id,
	    { 
	      titulo,
	      duracion,
	      publicado,
	      tema,
	      idioma,
	      fabricante,
	      observaciones
	    }, { new: true });  		

  		if (!tutorial) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.TUTORIAL_NO_ENCONTRADO });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.TUTORIAL_ACTUALIZADO, tutorial });
  	  } catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	  }	  		  
	});
};

exports.borrarTutorial = async (req, res, next) => {
	try {
		const { id } = req.params;
		const tutorial = await Tutorial.findOneAndDelete({_id: id});  		
		
		if (!tutorial) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.TUTORIAL_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({ msg: Mensaje.TUTORIAL_BORRADO, tutorial });

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};


const schema = Joi.object().keys({
	titulo    : Joi.string().required().error(new Error(Mensaje.TITULO_REQUERIDO)),
	duracion  : Joi.number().integer().required().min(duracionMinima).error(new Error(Mensaje.DURACION_NO_VALIDA)),
	publicado : Joi.number().integer().required().min(añoMinimo).max(añoActual).error(new Error(Mensaje.AÑO_PUBLICACION_NO_VALIDO)),
	tema      : Joi.any().required(),
	idioma    : Joi.any().required(),
	fabricante: Joi.any().required()
});