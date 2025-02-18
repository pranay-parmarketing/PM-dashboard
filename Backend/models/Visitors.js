const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  date: {
    type: String,
    unique: true, 
  },
  activeUsers: {
    type: String,
  },
});

module.exports = mongoose.model("Visitor", VisitorSchema);
