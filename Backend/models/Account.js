// models/Account.js
const mongoose = require('mongoose');

// Define the schema for the Account model
const AccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,  // The account name is required
  },
  facebookAccountId: {
    type: String,
    required: true,  // The Facebook Account ID is required
  },

});

// Create and export the Account model
const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
