const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  id: String,
  name: String,
  status: String,
  objective: String,
  start_time: Date,
  account_id: String,
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', CampaignSchema);
module.exports = Campaign;
