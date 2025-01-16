const mongoose = require("mongoose");
const AdSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    status: { type: String },
    facebookAdId: { type: String },
    adset_id: { type: String },
    adset: {
      name: { type: String },
      id: { type: String },
    },
    campaign_id: { type: String },
    campaign: { type: String },
    created_time: { type: Date },
    updated_time: { type: Date },
    account_id: { type: String }, 
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Ad", AdSchema);
