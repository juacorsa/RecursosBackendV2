const express = require('express');

const app = express();

require('./boot/config')(app);
require('./boot/routes')(app);
//require('./boot/error')(app);
require('./boot/db')(app);

module.exports = app;