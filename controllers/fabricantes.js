const HttpStatus = require('http-status-codes');
const Joi = require('@hapi/joi');
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
	const { id } = req.params;
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
	const { nombre } = req.body; 	

 	const existe = await Fabricante.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.FABRICANTE_YA_EXISTE });	

	const input = { nombre }	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }
	
	  const fabricante = new Fabricante({nombre});	  

	  try {
		await fabricante.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.FABRICANTE_REGISTRADO, fabricante });	
		} catch(err) {
			err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
	    	next(err);
	  }
	});
};

exports.actualizarFabricante = async (req, res, next) => {
	const { id } = req.params;
	const { nombre } = req.body;

 	const existe = await Fabricante.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
	if (existe) 
		return res.status(HttpStatus.BAD_REQUEST).json({ msg: Mensaje.FABRICANTE_YA_EXISTE });

	const input = { nombre }	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }
	
	  const fabricante = new Fabricante({nombre});	  
  	  try {
  		const fabricante = await Fabricante.findByIdAndUpdate(id, { nombre }, { new: true });		
  		if (!fabricante) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.FABRICANTE_NO_ENCONTRADO });
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.FABRICANTE_ACTUALIZADO, fabricante });
  	  } catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	  }
	});
};

const schema = Joi.object().keys({
	nombre : Joi.string().min(3).required().error(new Error(Mensaje.NOMBRE_REQUERIDO))
});