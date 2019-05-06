const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');

const Fabricante = require('../models/fabricante');
const Mensaje = require('../mensaje');

exports.obtenerFabricantes = async (req, res, next) => { 
	let ordenarPor = 'nombre';
	
	if (req.query.sortBy) {
		const split = req.query.sortBy.split(':');					
		ordenarPor = split[1] === 'asc' ? split[0] : '-' + split[0];		
	}	

	try {
		const total = await Fabricante.find().countDocuments();
		const fabricantes = await Fabricante.find().sort(ordenarPor);
		res.status(HttpStatus.OK).json({fabricantes, total});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

exports.obtenerFabricante = async (req, res, next) => { 
	const id = req.params.id;
	const fabricante = await Fabricante.findById(id);
	
	try {
		if (!fabricante) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.FABRICANTE_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({fabricante});

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};

exports.registrarFabricante =  async (req, res, next) => { 
	const nombre = req.body.nombre;
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
 	const existe = await Fabricante.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.FABRICANTE_YA_EXISTE });

	const fabricante = new Fabricante({nombre});

	try {
		await fabricante.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.FABRICANTE_REGISTRADO, fabricante });	

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	
};

exports.actualizarFabricante = async (req, res, next) => {
	const id = req.params.id;
	const nombre = req.body.nombre;
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
 	const existe = await Fabricante.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.FABRICANTE_YA_EXISTE });
  
  	try {
  		const fabricante = await Fabricante.findByIdAndUpdate(id, { nombre }, { new: true });		
  		if (!fabricante) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.FABRICANTE_NO_ENCONTRADO });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.FABRICANTE_ACTUALIZADO, fabricante });
  	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	  	
};