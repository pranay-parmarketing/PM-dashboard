const mongoose = require("mongoose");

const dmpSchema = new mongoose.Schema({
  cust_name: { type: String },
  phone: { type: String },
  email: { type: String },
  agent_id: { type: String },
  agent_username: { type: String },
  agent_name: { type: String },
  campaign_id: { type: String },
  campaign_name: { type: String },
  process_name: { type: String },
  process_id: { type: String },
  first_disposition: { type: String },
  second_disposition: { type: String },
  call_start_time: { type: Date },
  call_end_time: { type: Date },
  record_url: { type: String },
  call_type: { type: String },
  source: { type: String },
  Created_On: {
    type: String,
    default: "NA",
  },
  lead_date: Date,
});

module.exports = mongoose.model("Dmp", dmpSchema);
