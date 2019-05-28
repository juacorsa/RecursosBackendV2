
const randomUrl = require('random-url');
const randomString = require("randomstring");
const random = require('random');

exports.generateUrl = () => { return randomUrl() + '.com' }

exports.generateString = () => { return randomString.generate() }

exports.generateYear = () => { return random.int(min = 2010, max = 2019) }

exports.generatePages = () => { return random.int(min = 1, max = 9999) }

exports.generateMinutes = () => { return random.int(min = 1, max = 9999) }

exports.getYear = () => { return new Date().getFullYear() }

