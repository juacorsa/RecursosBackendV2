const express = require('express');
const router = express.Router();
const seedTemasController = require('../controllers/seedTemasController');

router.get('/', seedTemasController.seed);

module.exports = router;
