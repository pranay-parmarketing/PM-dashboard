const multer = require("multer");
const XLSX = require("xlsx");
const Ad = require("../models/Ads");

// Multer configuration for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Function to process and save Ads data
const createAdsData = async (req, res) => {
  try {
    let ads = [];

    // Process JSON data from the request body (if any)
    if (req.body && Object.keys(req.body).length > 0) {
      ads = Array.isArray(req.body) ? req.body : [req.body];
    }
    
    //
    // Process Excel file (if uploaded)
    if (req.file) {
      const fileBuffer = req.file.buffer;

      // Parse Excel file into JSON
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Add Excel data to ads array
      ads = ads.concat(sheetData);
    }

    if (ads.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided in request body or file" });
    }

    // Insert ads into the database
    for (const ad of ads) {
      // Adjust the query to check if the ad already exists by its unique identifier (e.g., id or facebookAdId)
      const existingAd = await Ad.findOne({ id: ad.id });

      // If the ad already exists, skip it
      if (existingAd) {
     
        
        continue;
      }
      // 120212995423690658 120212995664610658
      // If the ad doesn't exist, insert it into the database
      await Ad.create(ad);
    }

    res.status(200).json({ message: "Ads saved successfully!" });
  } catch (err) {
    console.error("Error saving ads:", err);
    res.status(500).json({ error: "Failed to save ads" });
  }
};
// Function to fetch Ads data based on the selected account
const getAdsData = async (req, res) => {
  try {
    const { selectedAccount } = req.params;

    const ads = await Ad.find({ account_id: selectedAccount });
    if (!ads.length) {
      return res.status(404).json({
        success: false,
        message: "No ads found for the selected account",
      });
    }

    res.status(200).json({ success: true, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to update Ads data based on the selected account
const updateAdsData = async (req, res) => {
  const { selectedAccount } = req.params;
  const { accountName } = req.body;
  try {
  
  
    const updatedAds = await Ad.findByIdAndUpdate(
      selectedAccount,
      { name: accountName },
      { new: true } // This option ensures the updated document is returned
    );
    if (!updatedAds) {
      return res.status(404).json({ message: "Account not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Ads data updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAdsData,
  getAdsData,
  updateAdsData,
  upload,
};
