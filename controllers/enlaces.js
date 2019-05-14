const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');

const Enlace = require('../models/enlace');
const Tema = require('../models/tema');
const Mensaje = require('../mensaje');

exports.obtenerEnlaces = async (req, res, next) => { 
	let ordenarPor = 'titulo';
	
	if (req.query.sortBy) {
		const split = req.query.sortBy.split(':');					
		ordenarPor = split[1] === 'asc' ? split[0] : '-' + split[0];		
	}	

	try {
		const total = await Enlace.find().countDocuments();
		const enlaces = await Enlace.find().populate('tema').sort(ordenarPor);
		res.status(HttpStatus.OK).json({enlaces, total});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

exports.obtenerEnlacesPorTema = async (req, res, next) => { 
	let ordenarPor = 'titulo';

	const id = req.params.id;
	const tema = await Tema.findById(id);

	if (!tema)
		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.TEMA_NO_ENCONTRADO });

	if (req.query.sortBy) {
		const split = req.query.sortBy.split(':');					
		ordenarPor = split[1] === 'asc' ? split[0] : '-' + split[0];		
	}	

	try {
		const total = await Enlace.find().countDocuments();
		const enlaces = await Enlace
			.find()
			.where('tema._id').equals(id)	
			.populate('tema')		
			.sort(ordenarPor);

		res.status(HttpStatus.OK).json({enlaces, total});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};


exports.obtenerEnlace = async (req, res, next) => { 	
	const enlace = await Enlace.findById(req.params.id);
	
	try {
		if (!enlace) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.ENLACE_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({enlace});

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};

exports.registrarEnlace =  async (req, res, next) => { 
	const errors = validationResult(req);
	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
	const enlace = new Enlace({
		titulo: req.body.titulo,
		url: req.body.url,
		observaciones: req.body.observaciones,
		tema: req.body.tema
	});

	try {
		await enlace.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.ENLACE_REGISTRADO, enlace });	

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	
};

exports.actualizarEnlace = async (req, res, next) => {
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  
  	try {
	  	const enlace = await Enlace.findByIdAndUpdate(req.params.id,
	    { 
	      titulo: req.body.titulo,
	      url   : req.body.url,
	      tema  : req.body.tema,
	      observaciones: req.body.observaciones
	    }, { new: true });  		

  		if (!enlace) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.ENLACE_NO_ENCONTRADO });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.ENLACE_ACTUALIZADO, enlace });
  	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	  	
};

exports.borrarEnlace = async (req, res, next) => {
	try {
		const enlace = await Enlace.findOneAndDelete({_id: req.params.id});  		
		
		if (!enlace) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.ENLACE_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({ msg: Mensaje.ENLACE_BORRADO, enlace });

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};