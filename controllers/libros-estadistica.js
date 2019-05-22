const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator/check');

const Libro = require('../models/libro');

exports.obtenerEstadisticaLibros = async (req, res, next) => { 	
	const { desde, hasta, tema, idioma, editorial } = req.query;
	
	try {				
		let match = {}					

		if ((desde) && (hasta)) {
			const publicado_desde = +desde;
			const publicado_hasta = +hasta;		
			match["publicado"] = { "$gte": publicado_desde, "$lte": publicado_hasta };
		}		
		if (tema) match["tema"] = { "$eq": tema };
		if (tema) match["idioma"] = { "$eq": idioma };
		if (tema) match["editorial"] = { "$eq": editorial };

		query = Libro.aggregate([		    
		    { $match: match },
		    { $group: { _id: null, total: { $sum: 1 } } }
		]);

		let result = await query.exec();			
		const libros = result.length == 0 ? 0 : result[0].total;

		query = Libro.aggregate([		    
		    { $match: match },
		    { $group: { _id: null, total: { $sum: "$paginas" } } }
		]);
		
		result = await query.exec();	
		const paginas = result.length == 0 ? 0 : result[0].total;
		
		res.status(HttpStatus.OK).json({libros, paginas});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

