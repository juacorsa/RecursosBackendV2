const HttpStatus = require('http-status-codes');
const Joi = require('@hapi/joi');
const Enlace = require('../models/enlace');
const Tema = require('../models/tema');
const Mensaje = require('../mensaje');

exports.obtenerEnlaces = async (req, res, next) => { 
	let ordenarPor = 'titulo';

	const { ordenar } = req.query;
	
	if (ordenar) {
		const split = ordenar.split(':');					
		ordenarPor = split[1].toLowerCase() === 'asc' ? split[0] : '-' + split[0];		
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

	const { id } = req.params;
	const { ordenar } = req.query;

	const tema = await Tema.findById(id);

	if (!tema)
		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.TEMA_NO_ENCONTRADO });

	if (ordenar) {
		const split = ordenar.split(':');					
		ordenarPor = split[1].toLowerCase() === 'asc' ? split[0] : '-' + split[0];		
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
	const { id } = req.params;

	const enlace = await Enlace.findById(id);
	
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
	const input = { 
		titulo: req.body.titulo,
		url: req.body.url 
	}	

	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }
	
      const { titulo, url, observaciones, tema } = req.body;  		
	  const enlace = new Enlace({titulo, url, observaciones, tema});

	  try {
		await enlace.save();
		res.status(HttpStatus.CREATED).json({ msg: Mensaje.ENLACE_REGISTRADO, enlace });	

	  } catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	  }	
	  });	


};

exports.actualizarEnlace = async (req, res, next) => {  
	const input = { 
		titulo: req.body.titulo,
		url: req.body.url 
	}	
  	
	Joi.validate(input, schema, async function(error, value) {
	  if (error) {	    
	    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({msg: error.message})
	  }
	
      const { id } = req.params;
      const { titulo, url, observaciones, tema } = req.body;  		
	  const enlace = new Enlace({titulo, url, observaciones, tema});

  	  try {
	  	const enlace = await Enlace.findByIdAndUpdate(id,
	    { 
	      titulo,
	      url,
	      tema,
	      observaciones
	    }, { new: true });  		

  		if (!enlace) 
  			return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.ENLACE_NO_ENCONTRADO });		
		
		res.status(HttpStatus.OK).json({ msg: Mensaje.ENLACE_ACTUALIZADO, enlace });
  	    } catch(err) {
			err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    		next(err);
	    }		
	});	
};


exports.borrarEnlace = async (req, res, next) => {
	const { id } = req.params;

	try {
		const enlace = await Enlace.findOneAndDelete({_id: id});  		
		
		if (!enlace) 
      		return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.ENLACE_NO_ENCONTRADO });    	

		res.status(HttpStatus.OK).json({ msg: Mensaje.ENLACE_BORRADO, enlace });

	} catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	} 
};

const schema = Joi.object().keys({
	titulo : Joi.string().required().error(new Error(Mensaje.TITULO_REQUERIDO)),
	url : Joi.string().required().uri().error(new Error(Mensaje.URL_FORMATO_INCORRECTO))
});