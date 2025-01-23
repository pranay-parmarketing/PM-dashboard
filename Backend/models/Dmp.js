const mongoose = require("mongoose");

const dmpSchema = new mongoose.Schema({
  lead_date: { type: Date },
  date: { type: Date },
  phone: { type: String },
  lead_id: { type: String },
  team: { type: String },
  transfer_to: { type: String },
  lvt_agent: { type: String },
  follow_up_date: { type: Date },
  source_raw: { type: String },
  update: { type: Date },
  created_at: { type: Date },
  updated_at: { type: Date },
  deleted_at: { type: Date, default: null }
});

module.exports = mongoose.model("Dmp", dmpSchema);
