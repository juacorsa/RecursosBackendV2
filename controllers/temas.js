const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');

const Tema = require('../models/tema');
const Mensaje = require('../mensaje');

exports.obtenerTemas = async (req, res, next) => { 
	let ordenarPor = 'nombre';
	
	if (req.query.sortBy) {
		const split = req.query.sortBy.split(':');					
		ordenarPor = split[1] === 'asc' ? split[0] : '-' + split[0];		
	}	

	try {
		const total = await Tema.find().countDocuments();
		const temas = await Tema.find().sort(ordenarPor);
		res.status(HttpStatus.OK).json({temas, total});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

exports.obtenerTema = async (req, res, next) => { 
	const id = req.params.id;
	const tema = await Tema.findById(id);
	
	try {
		if (!tema) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.TEMA_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({tema});

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};

exports.registrarTema =  async (req, res, next) => { 
	const nombre = req.body.nombre;
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
 	const existe = await Tema.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.TEMA_YA_EXISTE });

	const tema = new Tema({ nombre: nombre });

	try {
		await tema.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.TEMA_REGISTRADO, tema });	

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	
};

exports.actualizarTema = async (req, res, next) => {
	const id = req.params.id;
	const nombre = req.body.nombre;
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
 	const existe = await Tema.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.TEMA_YA_EXISTE });
  
  	try {
  		const tema = await Tema.findByIdAndUpdate(id, { nombre }, { new: true });		
  		if (!tema) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.TEMA_NO_ENCONTRADO });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.TEMA_ACTUALIZADO, tema });
  	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	  	
};

