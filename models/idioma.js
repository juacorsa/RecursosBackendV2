const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const idiomaSchema = new Schema({
	nombre: { type: String, required: true }
});

module.exports = mongoose.model('Idioma', idiomaSchema);