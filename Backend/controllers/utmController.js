const UtmData = require("../models/utmModel");

// Controller to save UTM data
const saveUtmData = async (req, res) => {
    try {
      let utmDataArray = [];
  
      // Process JSON data from the request body (if any)
      if (req.body && Object.keys(req.body).length > 0) {
        utmDataArray = Array.isArray(req.body) ? req.body : [req.body];
      }
      console.log("Received data:", utmDataArray);
  
      // If there is no data provided in the request body
      if (utmDataArray.length === 0) {
        return res.status(400).json({ error: 'No data provided in the request body' });
      }
  
      // Iterate over the UTM data to check for duplicates and save
      for (const utmData of utmDataArray) {
        const { utmSource, utmMedium, utmCampaign, account_id, id } = utmData;
  
        // Log the data being processed for debugging
        console.log('Processing UTM Data:', utmData);
  
        // Check if any required field is missing except 'id'
        if (!utmSource || !utmMedium || !utmCampaign || !account_id) {
          console.log('Missing required fields:', utmData);
          continue; // Skip this entry if required fields are missing
        }
  
        // If 'id' is provided, check for duplicates
        if (id) {
          const existingData = await UtmData.findOne({ id });
  
          if (existingData) {
            // If data with the same `id` exists, skip it
            console.log(`UTM Data with ID ${id} already exists, skipping.`);
            continue;
          }
        }
  
        // If no duplicate or no 'id', create and save the new UTM data
        const newUtmData = new UtmData({
          utmSource,
          utmMedium,
          utmCampaign,
          account_id,
          id,  // If `id` is provided, it will be saved; if not, it will be saved as `undefined`
        });
  
        // Save the data
        await newUtmData.save();
      }
  
      res.status(201).json({
        message: 'UTM data saved successfully',
      });
    } catch (err) {
      console.error('Error saving UTM data:', err.message);
      res.status(500).json({
        error: 'Failed to save UTM data',
        details: err.message || err,
      });
    }
  };
  
  

const getUtmData = async (req, res) => {
  try {
    const utmData = await UtmData.find(); // Fetch all UTM data from MongoDB

    if (utmData.length === 0) {
      return res.status(404).json({ message: "No UTM data found" });
    }

    // Send the UTM data as the response
    res.status(200).json(utmData);
  } catch (error) {
    console.error("Error fetching UTM data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  saveUtmData,
  getUtmData,
};
