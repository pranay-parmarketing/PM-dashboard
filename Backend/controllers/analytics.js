// const { BetaAnalyticsDataClient } = require('@google-analytics/data');
// const path = require('path');
// require('dotenv').config();

// // Load service account key JSON file
// const analyticsDataClient = new BetaAnalyticsDataClient({
//   keyFilename: path.join(__dirname, '../service-account.json'),
// });

// // Replace with your Google Analytics GA4 property ID
// const PROPERTY_ID = '265067350';

// exports.getVisitorCount = async (req, res) => {
//   try {
//     const [response] = await analyticsDataClient.runReport({
//       property: `properties/${PROPERTY_ID}`,
//       dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
//       metrics: [{ name: 'activeUsers' }],
//     });

//     const visitorCount = response.rows[0]?.metricValues[0]?.value || 0;
//     res.json({ visitorCount });
//   } catch (error) {
//     console.error('Error fetching analytics data:', error);
//     res.status(500).json({ error: 'Failed to fetch visitor count' });
//   }
// };

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');
require('dotenv').config();

// Load service account key JSON file
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(__dirname, '../service-account.json'),
});

// ✅ Replace with your actual GA4 Property ID
const PROPERTY_ID = "265067350"; // Use your numeric GA4 Property ID

exports.getAnalyticsData = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },    // Total visitors
        { name: 'newUsers' },       // New visitors
        { name: 'screenPageViews' }, // Page views
        { name: 'sessions' },       // Sessions
        { name: 'bounceRate' }      // Bounce rate
      ],
      dimensions: [{ name: 'country' }, { name: 'browser' }], // Data grouped by country & browser
    });

    // Transform response into a readable format
    const analyticsData = response.rows.map(row => ({
      country: row.dimensionValues[0]?.value || "Unknown",
      browser: row.dimensionValues[1]?.value || "Unknown",
      activeUsers: row.metricValues[0]?.value || "0",
      newUsers: row.metricValues[1]?.value || "0",
      pageViews: row.metricValues[2]?.value || "0",
      sessions: row.metricValues[3]?.value || "0",
      bounceRate: row.metricValues[4]?.value || "0",
    }));

    res.json({ analyticsData });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
};
