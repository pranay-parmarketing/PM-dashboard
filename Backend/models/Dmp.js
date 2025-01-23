// const mongoose = require("mongoose");

// const dmpSchema = new mongoose.Schema({
//   lead_date: { type: Date },
//   date: { type: Date },
//   phone: { type: String },
//   lead_id: { type: String },
//   team: { type: String },
//   transfer_to: { type: String },
//   lvt_agent: { type: String },
//   follow_up_date: { type: Date },
//   source_raw: { type: String },
//   update: { type: Date },
//   created_at: { type: Date },
//   updated_at: { type: Date },
//   deleted_at: { type: Date, default: null }
// });

// module.exports = mongoose.model("Dmp", dmpSchema);


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
});

module.exports = mongoose.model("Dmp", dmpSchema);
