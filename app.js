const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const temasRoutes = require('./routes/temas');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/temas', temasRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


let MONGO_URI;

if (process.env.NODE_ENV == 'test')
  MONGO_URI = 'mongodb://localhost:27017/recursos';

else
  MONGO_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds153763.mlab.com:53763/${process.env.MONGO_DATABASE}`;


const PORT = process.env.PORT || 5000;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
	.then(() => {
		console.log('Conectado a MongoDB con éxito ....');
		app.listen(PORT);
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});	

  module.exports = app;