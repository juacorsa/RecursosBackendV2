const temas = require('../routes/temas');
const fabricantes = require('../routes/fabricantes');
const editoriales = require('../routes/editoriales');
const idiomas = require('../routes/idiomas');

module.exports = function(app) {	
	app.use('/api/temas', temas);
	app.use('/api/fabricantes', fabricantes);
	app.use('/api/editoriales', editoriales);
	app.use('/api/idiomas', idiomas);
}