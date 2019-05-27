const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');

const Libro = require('../models/libro');
const Mensaje = require('../mensaje');

exports.obtenerLibros = async (req, res, next) => { 
	const { desde, hasta, tema, idioma, editorial, ordenar } = req.query;
	
	try {		
		let query = Libro
			.find()
			.populate('tema')
			.populate('editorial')
			.populate('idioma');

		if (desde) query.where('publicado').gte(desde);		
		if (hasta) query.where('publicado').lte(hasta);
		if (tema) query.where('tema').equals(tema);
		if (idioma) query.where('idioma').equals(idioma);
		if (editorial) query.where('editorial').equals(editorial);	
	
		if (ordenar) {
			const split = ordenar.split(':');					
			const ordenarPor = split[1].toLowerCase() === 'asc' ? split[0] : '-' + split[0];		
			query.sort(ordenarPor);
		} else {
			query.sort('titulo');
		}
	
		const libros = await query.exec();
		const total_libros = libros.length;

		let total_paginas = 0;			
		Object.keys(libros).forEach(i => total_paginas += libros[i].paginas);

		res.status(HttpStatus.OK).json({libros, total_libros, total_paginas});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

exports.obtenerLibro = async (req, res, next) => { 	
	const { id } = req.params;
	const libro = await Libro.findById(id);
	
	try {
		if (!libro) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.LIBRO_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({libro});

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};

exports.registrarLibro =  async (req, res, next) => { 
	const errors = validationResult(req);
	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  		
	const { titulo, paginas, publicado, observaciones, tema, editorial, idioma } = req.body;
	const libro = new Libro({titulo, paginas, publicado, observaciones, tema, editorial, idioma});

	try {
		await libro.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.LIBRO_REGISTRADO, libro });	

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	
};

exports.actualizarLibro = async (req, res, next) => {
	const errors = validationResult(req);
 	
 	if (!errors.isEmpty()) 
    	return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  
  	const { id } = req.params;
  	const { titulo, paginas, publicado, observaciones, tema, editorial, idioma } = req.body;

  	try {
	  	const libro = await Libro.findByIdAndUpdate(id,
	    { 
	      titulo,
	      paginas,
	      publicado,
	      tema,
	      idioma,
	      editorial,
	      observaciones
	    }, { new: true });  		

  		if (!libro) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.LIBRO_NO_ENCONTRADO });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.LIBRO_ACTUALIZADO, libro });
  	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}	  	
};

exports.borrarLibro = async (req, res, next) => {
	try {
		const { id } = req.params;
		const libro = await Libro.findOneAndDelete({_id: id});  		
		
		if (!libro) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.LIBRO_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({ msg: Mensaje.LIBRO_BORRADO, libro });

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};
