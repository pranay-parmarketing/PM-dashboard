// routes/accountRoutes.js
const express = require('express');
const {getauthtoken } = require('../controllers/getauthtoken');
const router = express.Router();

router.post('/', getauthtoken);

module.exports = router;

//saveBudget