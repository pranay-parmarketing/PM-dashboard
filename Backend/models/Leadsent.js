const mongoose = require("mongoose");

const leadsentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    unique: true,  // Ensure phone number is unique to avoid duplicates
    required: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits"],  // Adjust regex if necessary
  },
  lead_id: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    trim: true,
  },
  transfer_to: {
    type: String,
    trim: true,
  },
  lvt_agent: {
    type: String,
    trim: true,
  },
  follow_up_date: {
    type: Date,
  },
  source_raw: {
    type: String,
    trim: true,
  },
  update: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
  deleted_at: {
    type: Date,
  },
});

module.exports = mongoose.model("Leadsent", leadsentSchema);
