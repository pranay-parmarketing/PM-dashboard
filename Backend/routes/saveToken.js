// routes/accountRoutes.js
const express = require('express');
const { createTokenData, getTokenData, } = require('../controllers/saveTokenController.js');
const router = express.Router();

// Route to create a new account
router.put('/', createTokenData);

// Route to fetch all accounts
router.get('/getToken', getTokenData);

module.exports = router;

//saveBudget