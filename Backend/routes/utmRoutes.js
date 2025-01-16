const express = require('express');
const router = express.Router();
const utmController = require('../controllers/utmController');
const analyticsController = require('../controllers/getAnalytics');

// POST route to save UTM data
router.post('/save-utm', utmController.saveUtmData);

// GET route to retrieve UTM data
router.get('/get-utm', utmController.getUtmData);

// Get Google Analytics data
router.get('/get-analytics-data', analyticsController.getAnalyticsData);

module.exports = router;
