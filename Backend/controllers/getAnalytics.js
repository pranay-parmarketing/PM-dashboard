require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

// Set up Google Analytics Reporting API
const analyticsreporting = google.analyticsreporting('v4');

// Function to get Google Analytics data
const getAnalyticsData = async (req, res) => {
  try {
    // Authenticate using the service account credentials from the .env file
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,  // Path from .env
      scopes: 'https://www.googleapis.com/auth/analytics.readonly',
    });

    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    // Get data from Google Analytics using the View ID from .env
    const response = await analyticsreporting.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: process.env.GA_VIEW_ID,  // View ID from .env
            dateRanges: [
              {
                startDate: '30daysAgo',
                endDate: 'yesterday',
              },
            ],
            metrics: [
              {
                expression: 'ga:sessions',  // Metric you want to fetch (sessions in this case)
              },
            ],
            dimensions: [
              {
                name: 'ga:sourceMedium',  // Dimension to break down the sessions by source/medium
              },
            ],
          },
        ],
      },
    });

    // Send the response data back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch Google Analytics data' });
  }
};

module.exports = {
  getAnalyticsData,
};
