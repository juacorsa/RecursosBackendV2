const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');

const Editorial = require('../models/editorial');
const Mensaje = require('../mensaje');

exports.obtenerEditoriales = async (req, res, next) => { 
	let ordenarPor = 'nombre';
	
	if (req.query.sortBy) {
		const split = req.query.sortBy.split(':');					
		ordenarPor = split[1] === 'asc' ? split[0] : '-' + split[0];		
	}	

	try {
		const total = await Editorial.find().countDocuments();
		const editoriales = await Editorial.find().sort(ordenarPor);
		res.status(HttpStatus.OK).json({editoriales, total});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

exports.obtenerEditorial = async (req, res, next) => { 
	const id = req.params.id;
	const editorial = await Editorial.findById(id);
	
	try {
		if (!editorial) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.EDITORIAL_NO_ENCONTRADA });    	

		res.status(HttpStatus.OK).json({editorial});

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};

exports.registrarEditorial =  async (req, res, next) => { 
	const nombre = req.body.nombre;
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
 	const existe = await Editorial.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.EDITORIAL_YA_EXISTE });

	const editorial = new Editorial({nombre});

	try {
		await editorial.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.EDITORIAL_REGISTRADA, editorial });	

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	
};

exports.actualizarEditorial = async (req, res, next) => {
	const id = req.params.id;
	const nombre = req.body.nombre;
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
 	const existe = await Editorial.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.EDITORIAL_YA_EXISTE });
  
  	try {
  		const editorial = await Editorial.findByIdAndUpdate(id, { nombre }, { new: true });		
  		if (!editorial) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.EDITORIAL_NO_ENCONTRADA });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.EDITORIAL_ACTUALIZADA, editorial });
  	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	  	
};