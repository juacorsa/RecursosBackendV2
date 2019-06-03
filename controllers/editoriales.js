const HttpStatus = require('http-status-codes');
const Joi = require('@hapi/joi');
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
	const { id } = req.params;
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
	const { nombre } = req.body; 	

 	const existe = await Editorial.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.EDITORIAL_YA_EXISTE });	

	const input = { nombre }	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }
	
	  const editorial = new Editorial({nombre});	  

	  try {
		await editorial.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.EDITORIAL_REGISTRADA, editorial });	

		} catch(err) {
			err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
	    	next(err);
	  	}
	  });		
};

exports.actualizarEditorial = async (req, res, next) => {
	const { id } = req.params;	
	const { nombre } = req.body;
  		
 	const existe = await Editorial.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.EDITORIAL_YA_EXISTE });
  
	const input = { nombre }	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }	
	  	  
  	  try {
  		const editorial = await Editorial.findByIdAndUpdate(id, { nombre }, { new: true });		
  		if (!editorial) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.EDITORIAL_NO_ENCONTRADA });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.EDITORIAL_ACTUALIZADA, editorial });
  	  } catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	 }	  	
	});
}

const schema = Joi.object().keys({
	nombre : Joi.string().min(3).required().error(new Error(Mensaje.NOMBRE_REQUERIDO))
});