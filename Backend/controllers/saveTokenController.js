const Token = require("../models/Token");
const mongoose = require("mongoose");

const createTokenData = async (req, res) => {
  try {
    const tokens = Array.isArray(req.body) ? req.body : [req.body]; // Normalize input to an array

    for (const token of tokens) {
      const existingToken = await Token.findOne({ id: token.id });

      if (existingToken) {
        // Update existing token
        await Token.findOneAndUpdate(
          { id: token.id },
          token, // Update the document with the new data
          { new: true } // Return the updated document
        );
        console.log(`Token with ID ${token.id} updated successfully.`);
      } else {
        // Create new token if it doesn't exist
        await Token.create(token);
        console.log(`Token with ID ${token.id} created successfully.`);
      }
    }

    res.status(200).json({ message: "Token(s) processed successfully!" });
  } catch (error) {
    console.error("Error processing token:", error);
    res.status(500).json({ error: "Failed to process token(s)" });
  }
};

  

const getTokenData = async (req, res) => {
  try {
    // Fetch all tokens without filtering by any field
    const tokens = await Token.find();

    // Log the fetched tokens for debugging purposes
    console.log("Fetched tokens:", tokens);

    // If no tokens are found, return a 404 response
    if (tokens.length === 0) {
      return res.status(404).json({ message: "No tokens found" });
    }

    // Return the tokens if found
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createTokenData,
  getTokenData,
};
