const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const temaSchema = require('./tema');
const fabricanteSchema = require('./fabricante');
const idiomaSchema = require('./idioma');

const tutorialSchema = new Schema({
	titulo:  { type: String, required: true, trim: true },
	duracion: { type: Number, required: true},
	publicado: { type: Number, required: true},
	tema: { type: mongoose.Schema.Types.ObjectId, ref: 'Tema' },		
	fabricante: { type: mongoose.Schema.Types.ObjectId, ref: 'Fabricante' },		
	idioma: { type: mongoose.Schema.Types.ObjectId, ref: 'Idioma' },		
	observaciones: { type: String },
	registrado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tutorial', tutorialSchema);