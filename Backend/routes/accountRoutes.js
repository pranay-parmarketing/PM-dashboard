// routes/accountRoutes.js
const express = require('express');
const { createAccount, getAccounts, deleteAccount ,updateAccount } = require('../controllers/accountController');
const router = express.Router();

// Route to create a new account
router.post('/', createAccount);

// Route to fetch all accounts
router.get('/', getAccounts);

// Route to delete an account by ID
router.delete('/:id', deleteAccount);

// Route to update an account by ID
router.put('/:id', updateAccount); // Add this line for the update route

module.exports = router;
