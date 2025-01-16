// routes/accountRoutes.js
const express = require('express');
const { createCampaignsData, getCampaignsData,updateCampaignsData, upload } = require('../controllers/saveCampaignsController');
const router = express.Router();

// Route to create a new account
router.post('/',upload.single("excelFile") ,createCampaignsData);

// Route to fetch all accounts
router.get('/:selectedAccount', getCampaignsData);
router.put('/:selectedAccount', updateCampaignsData);

module.exports = router;
 