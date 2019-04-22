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


const PORT = process.env.PORT || 5000;


mongoose.connect(MONGO_URI, { useNewUrlParser: true })
	.then(() => {
		console.log('Conectado a MongoDB con éxito ....');
		app.listen(PORT);
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});	




