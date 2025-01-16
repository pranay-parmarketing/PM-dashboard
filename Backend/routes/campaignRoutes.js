const express = require('express');
const router = express.Router();
const { getCampaignData } = require('../controllers/campaignController');

// Route to fetch campaign data by campaignId
router.get('/campaign/:campaignId', getCampaignData);

module.exports = router;
