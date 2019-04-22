const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const temaSchema = new Schema({
	nombre: { type: String, required: true }
});

module.exports = mongoose.model('Tema', temaSchema);

