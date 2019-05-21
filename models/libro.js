const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const temaSchema = require('./tema');
const editorialSchema = require('./editorial');
const idiomaSchema = require('./idioma');

const libroSchema = new Schema({
	titulo:  { type: String, required: true, trim: true },
	paginas: { type: Number, required: true},
	publicado: { type: Number, required: true},
	tema: { type: mongoose.Schema.Types.ObjectId, ref: 'Tema' },		
	editorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Editorial' },		
	idioma: { type: mongoose.Schema.Types.ObjectId, ref: 'Idioma' },		
	observaciones: { type: String },
	registrado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Libro', libroSchema);