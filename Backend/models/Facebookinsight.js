const mongoose = require('mongoose');

const FacebookAdInsightSchema = new mongoose.Schema({
    account_id: { type: String, required: true },
    campaign_id: String,
    campaign_name: String,
    spend: Number,
    reach: Number,
    impressions: Number,
    frequency: Number,
    ctr: Number,
    cpp: Number,
    cpc: Number,
    cpm: Number,
    cost_per_unique_click: Number,
    clicks: Number,
    inline_link_click_ctr: Number,
    inline_link_clicks: Number,
    adset_name: String,
    date_start: String, // Add this to match API response
    start_date: String, // Store the requested start_date
    end_date: String, // Store the requested end_date
    timestamp: { type: Date, default: Date.now } // Store timestamp
});

module.exports = mongoose.model('FacebookAdInsight', FacebookAdInsightSchema);
