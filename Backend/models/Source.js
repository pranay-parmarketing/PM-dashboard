const mongoose = require("mongoose");

const SourceDataSchema = new mongoose.Schema({
  account_id: {
    type: String,
    required: true, // Store the account ID for reference
  },
  adset_name: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  campaign_name: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically store creation date
  }
});

module.exports = mongoose.model("SourceData", SourceDataSchema);
