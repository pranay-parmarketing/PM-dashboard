const express = require('express');
const router = express.Router();
const { testData } = require('../controllers/testController');



router.get('/', testData);

module.exports = router;
