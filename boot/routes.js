const temas = require('../routes/temas');
const fabricantes = require('../routes/fabricantes');
const editoriales = require('../routes/editoriales');
const idiomas = require('../routes/idiomas');
const enlaces = require('../routes/enlaces');
const libros = require('../routes/libros');

module.exports = function(app) {	
	app.use('/api/temas', temas);
	app.use('/api/fabricantes', fabricantes);
	app.use('/api/editoriales', editoriales);
	app.use('/api/idiomas', idiomas);
	app.use('/api/enlaces', enlaces);
	app.use('/api/libros', libros);
}
