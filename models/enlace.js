const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const temaSchema = require('./tema');

const enlaceSchema = new Schema({
	titulo: { type: String, required: true, trim: true },
	url:    { type: String, required: true, trim: true },
	tema:   { type: mongoose.Schema.Types.ObjectId, ref: 'Tema' },		
	observaciones: { type: String },
	registrado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enlace', enlaceSchema);