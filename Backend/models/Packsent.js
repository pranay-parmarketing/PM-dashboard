const mongoose = require("mongoose");

const PackSentSchema = new mongoose.Schema({
  leadId: { type: String, required: true }, 
  leadDate: { type: String }, 
  name: { type: String }, 
  phone: { type: String }, 
  email: { type: String }, 
  source: { type: String}, 
  sentDate: { type: String}, 
  completedDate: { type: String }, 
  status: { type: String }, 
  agentname: { type: String }, 	
  di: { type: String }, 	
}, { timestamps: true });

module.exports = mongoose.model("Packsent", PackSentSchema);
