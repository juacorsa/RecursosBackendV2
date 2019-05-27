const temas = require('../routes/temas');
const fabricantes = require('../routes/fabricantes');
const editoriales = require('../routes/editoriales');
const idiomas = require('../routes/idiomas');
const enlaces = require('../routes/enlaces');
const libros = require('../routes/libros');
const tutoriales = require('../routes/tutoriales');
const libros_estadistica = require('../routes/libros_estadistica');

module.exports = function(app) {	
	app.use('/api/temas', temas);
	app.use('/api/fabricantes', fabricantes);
	app.use('/api/editoriales', editoriales);
	app.use('/api/idiomas', idiomas);
	app.use('/api/enlaces', enlaces);	
	app.use('/api/libros', libros);	
	app.use('/api/tutoriales', tutoriales);	
	app.use('/api/estadistica/libros', libros_estadistica);
}
