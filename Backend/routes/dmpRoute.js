const express = require('express');
const router = express.Router();
const { createDmpData, getDmpData, upload } = require('../controllers/dmpController');

router.post('/', upload, createDmpData);

router.get('/', getDmpData);

module.exports = router;
