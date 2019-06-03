const HttpStatus = require('http-status-codes');
const Joi = require('@hapi/joi');
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
	const { id } = req.params;
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
	const { nombre } = req.body; 	

 	const existe = await Tema.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.TEMA_YA_EXISTE });	

	const input = { nombre }	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }
	
	  const tema = new Tema({nombre});	  

	  try {
		await tema.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.TEMA_REGISTRADO, tema });	

		} catch(err) {
			err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
	    	next(err);
	  	}
	  });		
};

exports.actualizarTema = async (req, res, next) => {
	const { id } = req.params;	
	const { nombre } = req.body;
  		
 	const existe = await Tema.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.TEMA_YA_EXISTE });
  
	const input = { nombre }	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }	
	  	  
  	  try {
  		const tema = await Tema.findByIdAndUpdate(id, { nombre }, { new: true });		
  		if (!tema) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.TEMA_NO_ENCONTRADO });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.TEMA_ACTUALIZADO, tema });
  	  } catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	 }	  	
	});
}

const schema = Joi.object().keys({
	nombre : Joi.string().min(3).required().error(new Error(Mensaje.NOMBRE_REQUERIDO)),
});