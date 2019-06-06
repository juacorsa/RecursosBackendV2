const HttpStatus = require('http-status-codes');
const Tutorial = require('../models/tutorial');

exports.obtenerEstadisticaTutoriales = async (req, res, next) => { 	
	const { desde, hasta, tema, idioma, fabricante } = req.query;
	
	try {				
		let match = {}					

		if ((desde) && (hasta)) {
			const publicado_desde = +desde;
			const publicado_hasta = +hasta;		
			match["publicado"] = { "$gte": publicado_desde, "$lte": publicado_hasta };
		}		
		if (tema) match["tema"] = { "$eq": tema };
		if (idioma) match["idioma"] = { "$eq": idioma };
		if (editorial) match["fabricante"] = { "$eq": fabricante };

		query = Tutorial.aggregate([		    
		    { $match: match },
		    { $group: { _id: null, total: { $sum: 1 } } }
		]);

		let result = await query.exec();			
		const tutoriales = result.length == 0 ? 0 : result[0].total;

		query = Tutorial.aggregate([		    
		    { $match: match },
		    { $group: { _id: null, total: { $sum: "$duracion" } } }
		]);
		
		result = await query.exec();	
		const duracion = result.length == 0 ? 0 : result[0].total;
		
		res.status(HttpStatus.OK).json({tutoriales, duracion});
	} 
	catch(err) {
		err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    	next(err);
	}
};

