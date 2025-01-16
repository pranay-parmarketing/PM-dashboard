// routes/accountRoutes.js
const express = require('express');
const { createAdsetData, getAdsetData,updateAdsetData, upload } = require('../controllers/saveAdsetController.js');
const router = express.Router();

// Route to create a new account
router.post('/', upload.single("excelFile"),createAdsetData);

// Route to fetch all accounts
router.get('/:selectedAccount', getAdsetData);
router.put('/:selectedAccount', updateAdsetData);

module.exports = router;

//saveBudget