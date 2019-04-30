const mongoose = require('mongoose');

module.exports = function(app) {
	let MONGO_URI;

	if (process.env.NODE_ENV == 'test')
	  MONGO_URI = 'mongodb://localhost:27017/recursos';

	else
	  MONGO_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds153763.mlab.com:53763/${process.env.MONGO_DATABASE}`;

	const PORT = process.env.PORT || 5000;
	mongoose.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
		.then(() => {
			console.log(`Servidor ejecutado en puerto ${PORT} ....`);
			app.listen(PORT);
		})
		.catch((err) => {
			console.log(err);
			process.exit(1);
		});	
}
