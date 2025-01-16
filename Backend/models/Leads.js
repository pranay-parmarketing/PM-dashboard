const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: false,  // Explicitly set this as false to avoid creating a unique index
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,  // This should remain unique since you want to avoid duplicates based on phone
    match: [/^\d{10}$/, "Phone number must be 10 digits"],  // Adjust regex if necessary
  },
  city: {
    type: String,
    trim: true,
  }, 
  brand: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
  },
  createdOn: {
    type: String,
  },
});

module.exports = mongoose.model("Lead", leadSchema);
