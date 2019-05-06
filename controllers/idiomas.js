const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');

const Idioma = require('../models/idioma');
const Mensaje = require('../mensaje');

exports.obtenerIdiomas = async (req, res, next) => { 
	let ordenarPor = 'nombre';
	
	if (req.query.sortBy) {
		const split = req.query.sortBy.split(':');					
		ordenarPor = split[1] === 'asc' ? split[0] : '-' + split[0];		
	}	

	try {
		const total = await Idioma.find().countDocuments();
		const idiomas = await Idioma.find().sort(ordenarPor);
		res.status(HttpStatus.OK).json({idiomas, total});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

exports.obtenerIdioma = async (req, res, next) => { 
	const id = req.params.id;
	const idioma = await Idioma.findById(id);
	
	try {
		if (!idioma) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.IDIOMA_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({idioma});

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};

exports.registrarIdioma =  async (req, res, next) => { 
	const nombre = req.body.nombre;
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
 	const existe = await Idioma.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.IDIOMA_YA_EXISTE });

	const idioma = new Idioma({nombre});

	try {
		await idioma.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.IDIOMA_REGISTRADO, idioma });	

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	
};

exports.actualizarIdioma = async (req, res, next) => {
	const id = req.params.id;
	const nombre = req.body.nombre;
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
 	const existe = await Idioma.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.IDIOMA_YA_EXISTE });
  
  	try {
  		const idioma = await Idioma.findByIdAndUpdate(id, { nombre }, { new: true });		
  		if (!idioma) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.IDIOMA_NO_ENCONTRADO });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.IDIOMA_ACTUALIZADO, idioma });
  	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	  	
};