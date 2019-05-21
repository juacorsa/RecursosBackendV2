
const randomUrl = require('random-url');
const randomstring = require("randomstring");

exports.generateUrl = () => { return randomUrl() + '.com' }

exports.generateString = () => { return randomstring.generate() }

exports.getYear = () => { return new Date().getFullYear() }

