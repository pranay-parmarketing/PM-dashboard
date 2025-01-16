const Adset = require("../models/Adset");
const multer = require("multer");
const XLSX = require("xlsx");

const upload = multer({ storage: multer.memoryStorage() });

// const createAdsetData = async (req, res) => {
//   try {
//     // Extract adsets from the request body
//     let adsets = [req.body];

//     // If adsets is not an array, wrap it in an array
//     if (!Array.isArray(adsets)) {
//       adsets = [adsets];
//     }

//     // Iterate over each adset in the payload
//     for (const adset of adsets) {
//       // Validate required fields
//       if (
//         !adset.id ||
//         !adset.name ||
//         !adset.account_id 
//         // ||
//         // !adset.campaign_id ||
//         // !adset.status
//       ) {
//         console.log(
//           `Missing required fields for adset with ID ${adset.id}. Skipping.`
//         );
//         continue;
//       }

//       // Check if an adset with the same ID already exists
//       const existingAdset = await Adset.findOne({ id: adset.id });
//       if (existingAdset) {
//         console.log(`Adset with ID ${adset.id} already exists. Skipping.`);
//         continue;
//       }

//       // Prepare the adset data
//       const adsetData = {
//         id: adset.id,
//         name: adset.name,
//         account_id: adset.account_id,
//         campaign_id: adset.campaign_id,
//         daily_budget: adset.daily_budget
//           ? parseInt(adset.daily_budget, 10)
//           : undefined,
//         optimization_goal: adset.optimization_goal,
//         start_time: adset.start_time ? new Date(adset.start_time) : undefined,
//         end_time: adset.end_time ? new Date(adset.end_time) : undefined,
//         status: adset.status,
//         targeting: adset.targeting,
//         promoted_object: adset.promoted_object,
//         campaign_name: adset.campaign ? adset.campaign.name : undefined,
//       };

//       // Save the adset
//       await Adset.create(adsetData);
//     }

//     res.status(200).json({ message: "Adsets saved successfully!" });
//   } catch (error) {
//     console.error("Error saving adsets:", error);
//     res.status(500).json({ error: "Failed to save adsets" });
//   }
// };
const createAdsetData = async (req, res) => {
  try {
    let adsets = [];

    // Process JSON data from the request body (if any)
    if (req.body && Object.keys(req.body).length > 0) {
      adsets = Array.isArray(req.body) ? req.body : [req.body];
    }
    console.log("Adsets from JSON:", adsets);

    // Process Excel file (if uploaded)
    if (req.file) {
      const fileBuffer = req.file.buffer;

      // Parse Excel file into JSON
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Add Excel data to adsets array
      adsets = adsets.concat(sheetData);
    }

    if (adsets.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided in request body or file" });
    }

    // Insert adsets into the database
    for (const adset of adsets) {
      // Validate required fields
      if (
        !adset.id ||
        !adset.name ||
        !adset.account_id
      ) {
        console.log(
          `Missing required fields for adset with ID ${adset.id}. Skipping.`
        );
        continue;
      }

      // Check if an adset with the same ID already exists
      const existingAdset = await Adset.findOne({ id: adset.id });
      if (existingAdset) {
        console.log(`Adset with ID ${adset.id} already exists. Skipping.`);
        continue;
      }

      // Prepare the adset data
      const adsetData = {
        id: adset.id,
        name: adset.name,
        account_id: adset.account_id,
        campaign_id: adset.campaign_id,
        daily_budget: adset.daily_budget
          ? parseInt(adset.daily_budget, 10)
          : undefined,
        optimization_goal: adset.optimization_goal,
        start_time: adset.start_time ? new Date(adset.start_time) : undefined,
        end_time: adset.end_time ? new Date(adset.end_time) : undefined,
        status: adset.status,
        targeting: adset.targeting,
        promoted_object: adset.promoted_object,
        campaign_name: adset.campaign ? adset.campaign.name : undefined,
      };

      // Save the adset
      await Adset.create(adsetData);
    }

    res.status(200).json({ message: "Adsets saved successfully!" });
  } catch (error) {
    console.error("Error saving adsets:", error);
    res.status(500).json({ error: "Failed to save adsets" });
  }
};


const getAdsetData = async (req, res) => {
  try {
    const { selectedAccount } = req.params;
    console.log(
      "Selected Account received:",
      typeof selectedAccount,
      selectedAccount
    );

    // Ensure that selectedAccount is a valid string before querying MongoDB
    if (typeof selectedAccount !== "string") {
      return res.status(400).json({ message: "Invalid account ID format" });
    }

    // Proceed with the query using the string account field
    const adset = await Adset.find({ account_id: selectedAccount });

    console.log("Fetched adset:", adset);

    if (adset.length === 0) {
      return res.status(404).json({ message: "No adset found" });
    }

    res.status(200).json(adset);
  } catch (error) {
    console.error("Error fetching adset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// update
const updateAdsetData = async (req, res) => {
  const { selectedAccount } = req.params; // Extract account ID from the URL
  const { accountName } = req.body; // Extract the updated data from the request body

  try {
    // Find the account by ID and update the fields
    console.log("this is id", selectedAccount);

    const updatedAdset = await Adset.findByIdAndUpdate(
      selectedAccount,
      { name: accountName },
      { new: true } // This option ensures the updated document is returned
    );

    if (!updatedAdset) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Respond with the updated account
    res
      .status(200)
      .json({ message: "Account updated successfully", data: updatedAdset });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  createAdsetData,
  getAdsetData,
  updateAdsetData,
  upload,
};
