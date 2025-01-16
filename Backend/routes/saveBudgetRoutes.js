
const express = require('express');
const { createBudgetData, getBudgetData } = require('../controllers/saveBudgetController.js');
const router = express.Router();

// Route to create a new account
router.post('/', createBudgetData);

// Route to fetch all accounts
router.get('/:selectedAccount', getBudgetData);

module.exports = router;

//saveBudget