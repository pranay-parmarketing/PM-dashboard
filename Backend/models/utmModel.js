const mongoose = require("mongoose");

const utmDataSchema = new mongoose.Schema(
  {
    id: { type: String },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String }, // This should contain the dynamic campaign
    account_id: { type: String }, // This should contain the account_id
  },
  { timestamps: true }
); // Adding timestamps for createdAt and updatedAt

const UtmData = mongoose.model("UtmData", utmDataSchema);

module.exports = UtmData;
