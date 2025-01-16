// const mongoose = require('mongoose');

// const AdsetSchema = new mongoose.Schema(
//   {
//     id: { type: String }, // Facebook Campaign ID
//     name: { type: String }, // Campaign Name
//     status: { type: Number }, // Daily Budget (in smallest currency unit)
//     objective: { type: Number }, // Lifetime Budget (in smallest currency unit)
//     status: { type: String }, // Campaign Status
//     start_time: { type: Date }, // Campaign Start Time
//     account_id: { type: String }, // Bid Strategy
   
//   },
//   { timestamps: true }
// );

// const Adset = mongoose.model('Adset', AdsetSchema);
// module.exports = Adset;


// const mongoose = require('mongoose');

// const AdsetSchema = new mongoose.Schema(
//   {
//     id: { type: String }, // Adset ID
//     name: { type: String }, // Adset Name
//     account_id: { type: String }, // Account ID
//     campaign_id: { type: String }, // Campaign ID
//     daily_budget: { type: Number }, // Daily Budget (in smallest currency unit)
//     optimization_goal: { type: String }, // Optimization Goal
//     start_time: { type: Date }, // Campaign Start Time
//     end_time: { type: Date }, // Campaign End Time
//     status: { type: String }, // Adset Status
//     targeting: { type: Object }, // Targeting Information (if any)
//     promoted_object: { type: Object }, // Promoted Object Information
//     campaign_name: { type: Object }, // Campaign Name
//   },
//   { timestamps: true } // This will automatically add `createdAt` and `updatedAt` fields
// );

// const Adset = mongoose.model('Adset', AdsetSchema);

// module.exports = Adset;


const mongoose = require('mongoose');

const AdsetSchema = new mongoose.Schema(
  {
    id: { type: String }, // Adset ID
    name: { type: String }, // Adset Name
    account_id: { type: String }, // Account ID
    campaign_id: { type: String }, // Campaign ID
    daily_budget: { type: Number }, // Daily Budget (in smallest currency unit)
    optimization_goal: { type: String }, // Optimization Goal
    start_time: { type: Date }, // Campaign Start Time
    end_time: { type: Date }, // Campaign End Time
    status: { type: String }, // Adset Status
    targeting: { type: Object }, // Targeting Information (if any)
    promoted_object: { type: Object }, // Promoted Object Information
    campaign_name: { type: String }, // Campaign Name
    spend: { type: Number }, // Total Spend (in smallest currency unit)
    reach: { type: Number }, // Total Reach (Number of unique users reached)
    impressions: { type: Number }, // Total Impressions
    frequency: { type: Number }, // Frequency (Average number of times each person saw the ad)
    cpc: { type: Number }, // Cost Per Click (in smallest currency unit)
    cpm: { type: Number }, // Cost Per Thousand Impressions (in smallest currency unit)
    conversions: { type: Number }, // Total Conversions (if any)
  },
  { timestamps: true } // This will automatically add `createdAt` and `updatedAt` fields
);

const Adset = mongoose.model('Adset', AdsetSchema);

module.exports = Adset;
