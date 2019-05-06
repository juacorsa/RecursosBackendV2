const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const editorialSchema = new Schema({
	nombre: { type: String, required: true }
});

module.exports = mongoose.model('Editorial', editorialSchema);