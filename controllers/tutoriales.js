const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');

const Tutorial = require('../models/tutorial');
const Mensaje = require('../mensaje');

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
	const errors = validationResult(req);
	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
	const { titulo, duracion, publicado, observaciones, tema, fabricante, idioma } = req.body;
	const tutorial = new Tutorial({titulo, duracion, publicado, observaciones, tema, fabricante, idioma});

	try {
		await tutorial.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.TUTORIAL_REGISTRADO, tutorial });	

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	
};

exports.actualizarTutorial = async (req, res, next) => {
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  
  	const { id } = req.params;
  	const { titulo, duracion, publicado, observaciones, tema, fabricante, idioma } = req.body;

  	try {
	  	const fabricante = await Tutorial.findByIdAndUpdate(id,
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


