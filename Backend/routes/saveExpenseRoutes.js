
const express = require('express');
const { createExpenseData, getExpenseData } = require('../controllers/saveExpenseController.js');
const router = express.Router();

// Route to create a new account
router.post('/', createExpenseData);

// Route to fetch all accounts
router.get('/:selectedAccount', getExpenseData);

module.exports = router;

