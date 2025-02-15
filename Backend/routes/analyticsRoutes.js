const express = require('express');
const { getAnalyticsData } = require('../controllers/analytics');

const router = express.Router();

// Define the route
router.get('/', getAnalyticsData);

module.exports = router;
