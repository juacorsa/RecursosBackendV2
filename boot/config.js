const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

module.exports = function(app) {
	app.use(express.json());
	app.use(helmet());	
	//app.use(morgan('combined'));
	app.use((req, res, next) => {
	    res.setHeader('Access-Control-Allow-Origin', '*');
	    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
	    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	    next();
	});
}