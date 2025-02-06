
const express = require('express');
const router = express.Router();
const {  getSourceData } = require('../controllers/sourceController.js');

router.get('/', getSourceData); 

module.exports = router;
