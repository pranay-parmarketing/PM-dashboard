const multer = require("multer");
const XLSX = require("xlsx");
const Campaign = require("../models/Campaign");

const upload = multer({ storage: multer.memoryStorage() });

const createCampaignsData = async (req, res) => {
  try {
    let campaigns = [];

    // Process JSON data from the request body (if any)
    if (req.body && Object.keys(req.body).length > 0) {
      campaigns = Array.isArray(req.body) ? req.body : [req.body];
    }

    // Process Excel file (if uploaded)
    if (req.file) {
      const fileBuffer = req.file.buffer;

      // Parse Excel file into JSON
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Add Excel data to campaigns array
      campaigns = campaigns.concat(sheetData);
    }

    if (campaigns.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided in request body or file" });
    }

    // Insert campaigns into the database
    for (const campaign of campaigns) {
      const existingCampaign = await Campaign.findOne({ id: campaign.id });

      if (existingCampaign) {
        continue;
      }

      await Campaign.create(campaign);
    }

    res.status(200).json({ message: "Campaigns saved successfully!" });
  } catch (err) {
    console.error("Error saving campaigns:", err);
    res.status(500).json({ error: "Failed to save campaigns" });
  }
};

const getCampaignsData = async (req, res) => {
  try {
    const { selectedAccount } = req.params; // Extract selectedAccount from URL parameters

    // Query the database to find campaigns for the selected account
    const campaigns = await Campaign.find({ account_id: selectedAccount }); // Ensure the field name matches your schema

    if (!campaigns || campaigns.length === 0) {
      console.warn(`No campaigns found for account: ${selectedAccount}`);
      return res
        .status(404)
        .json({ message: "No campaigns found for the selected account" });
    }

    return res.status(200).json(campaigns); // Return the fetched campaigns
  } catch (error) {
    console.error("Error occurred while fetching campaigns:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//

const updateCampaignsData = async (req, res) => {
  const { selectedAccount } = req.params; // Extract account ID from the URL
  const { accountName } = req.body; // Extract the updated data from the request body

  try {
    // Find the account by ID and update the fields

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      selectedAccount,
      { name: accountName },
      { new: true } // This option ensures the updated document is returned
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Respond with the updated account
    res
      .status(200)
      .json({ message: "Account updated successfully", data: updatedCampaign });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  createCampaignsData,
  getCampaignsData,
  updateCampaignsData,
  upload,
};
