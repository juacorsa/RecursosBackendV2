const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fabricanteSchema = new Schema({
	nombre: { type: String, required: true }
});

module.exports = mongoose.model('Fabricante', fabricanteSchema);