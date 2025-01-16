
const mongoose = require("mongoose");

const campaignBudgetSchema = new mongoose.Schema(
  {
    campaignId: { type: String, required: true, unique: true },
    data: { type: Array, required: true },
    budgetDate: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CampaignBudget", campaignBudgetSchema);
