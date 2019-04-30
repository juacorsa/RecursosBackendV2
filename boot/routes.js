const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const temas = require('../routes/temas');

module.exports = function(app) {
	app.use(express.json());
	app.use(helmet());	
	app.use(morgan('combined'));
	
	app.use('/api/temas', temas);
}