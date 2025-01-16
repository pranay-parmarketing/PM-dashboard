// controllers/campaignController.js
const axios = require('axios');
const Campaign = require('../models/Campaign');
const { appsecret_proof, access_token } = process.env;  // Make sure to load your env variables

// Function to fetch and save campaign data
const fetchAndSaveCampaignData = async (campaignId) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${campaignId}?fields=id,name,created_time,adsets{daily_budget,lifetime_budget,budget_remaining,status,insights{spend},campaign{id,name,insights{spend}},ads{id,name}}&appsecret_proof=${appsecret_proof}&access_token=${access_token}`
    );

    const adsetsData = response.data?.adsets?.data || [];
    const formattedData = adsetsData.map((adset) => ({
      name: adset.name || "N/A",
      level: "Adset",
      budget: adset.daily_budget
        ? `${parseInt(adset.daily_budget) / 100} (Daily Budget)`
        : adset.budget_remaining
        ? `${parseInt(adset.budget_remaining) / 100} (Remaining Budget)`
        : "N/A",
    }));

    const campaignData = {
      name: response.data?.name || "N/A",
      level: "Campaign",
      budget:
        adsetsData.reduce((total, adset) => {
          return total + (parseFloat(adset.insights?.spend) || 0);
        }, 0) || "N/A",
    };

    // Save data to the database
    const campaign = await Campaign.findOneAndUpdate(
      { campaignId: campaignId },
      { data: [...formattedData, campaignData], budgetDate: response.data.created_time },
      { new: true, upsert: true }
    );

    return campaign;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    throw new Error('Failed to fetch or save campaign data');
  }
};

// Endpoint to fetch campaign data from MongoDB
const getCampaignData = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ campaignId: req.params.campaignId });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign data not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign from DB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { fetchAndSaveCampaignData, getCampaignData };
