const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const Mensaje = require('../mensaje');

module.exports = function(req, res, next){
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
  	return res.status(HttpStatus.NOT_FOUND).json({ msg: Mensaje.PARAMETRO_ID_INCORRECTO });

  next();
}