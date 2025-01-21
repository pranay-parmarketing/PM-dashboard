const mongoose = require("mongoose");

const dmpSchema = new mongoose.Schema({
    lead_date: { type: Date }, 
    date: { type: Date }, 
    phone: { type: String }, 
    source: { type: String }, 
    agent: { type: String } 
});

module.exports = mongoose.model("Dmp", dmpSchema);
