// controllers/accountController.js
const Account = require("../models/Account");

// Controller to create a new account
const createAccount = async (req, res) => {
  try {
    const { accountName, facebookAccountId } = req.body;

    // Check for existing accountName or facebookAccountId
    const existingAccountByName = await Account.findOne({ accountName });
    const existingAccountById = await Account.findOne({ facebookAccountId });

    if (existingAccountByName || existingAccountById) {
      let message = "Account already exists with ";
      if (existingAccountByName) message += `name: ${accountName}`;
      if (existingAccountById) message += ` ID: ${facebookAccountId}`;
      return res.status(400).json({ message });
    }

    // Create a new account
    const newAccount = new Account({
      accountName,
      facebookAccountId,
    });

    await newAccount.save();
    res.status(201).json(newAccount); // Respond with the created account
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate entry detected. Please check your data." });
    }
    res.status(500).json({ message: "Server error" });
  }
};


// Controller to fetch all accounts
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find(); // Fetch all accounts from the database
    res.status(200).json(accounts); // Respond with the list of accounts
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handle errors
  }
};

// Controller to Delete accounts
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deletedAccount = await Account.findByIdAndDelete(id); // Delete the account by ID

    if (!deletedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    res
      .status(200)
      .json({ message: "Account deleted successfully", deletedAccount });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete account", error: error.message });
  }
};

// Controller to update Account
const updateAccount = async (req, res) => {
  const { id } = req.params; // Extract account ID from the URL
  const { accountName, facebookAccountId } = req.body; // Extract the updated data from the request body

  try {
    // Find the account by ID and update the fields
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { accountName, facebookAccountId },
      { new: true } // This option ensures the updated document is returned
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Respond with the updated account
    res
      .status(200)
      .json({ message: "Account updated successfully", data: updatedAccount });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  deleteAccount,
  updateAccount,
};
