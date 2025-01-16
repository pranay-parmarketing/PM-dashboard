// routes/accountRoutes.js
const express = require('express');
const { createAdsData, getAdsData,updateAdsData, upload } = require('../controllers/saveAdsController.js');
const router = express.Router();

// Route to create a new account
router.post('/', upload.single("excelFile"),createAdsData);

// Route to fetch all accounts
router.get('/:selectedAccount', getAdsData);
router.put('/:selectedAccount', updateAdsData);

module.exports = router;

//saveBudget