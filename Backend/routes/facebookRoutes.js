const express = require('express');
const { fetchAndStoreFacebookInsights, getFacebookInsights } = require('../controllers/facebookController');

const router = express.Router();

// Route to fetch and store Facebook Ad Insights
router.post('/', fetchAndStoreFacebookInsights);

// Route to get stored insights from MongoDB based on account_id
router.get('/:account_id', getFacebookInsights);

module.exports = router;