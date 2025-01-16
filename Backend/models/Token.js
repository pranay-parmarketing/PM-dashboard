const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    accessToken: { type: String, required: true },
    appSecretProof: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  

module.exports = mongoose.model('Token', TokenSchema);
