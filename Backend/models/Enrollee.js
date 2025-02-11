const mongoose = require("mongoose");

const enrolleeSchema = new mongoose.Schema({
  leadDate: { type: Date },
  date: { type: Date },
  source: { type: String },
  agent: { type: String },
  client: { type: String },
  city: { type: String },
  email: { type: String },
  paymentMode: { type: String },
  paymentMade: { type: String },
  paymentNumber: { type: String },
  contactNo: { type: String, unique: true },
  disposableIncome: { type: Number },
  gst: { type: Number },
  net: { type: Number },
  status: { type: String }
}, { timestamps: true });

const Enrollee = mongoose.model("Enrollee", enrolleeSchema);

module.exports = Enrollee;
