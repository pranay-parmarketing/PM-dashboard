// const Campaign = require("../models/Campaign");

// const createCampaignsData = async (req, res) => {
//   try {
//     // Get campaigns data from the request body
//     let campaigns = req.body;

//     // If campaigns is not an array, wrap it in an array
//     if (!Array.isArray(campaigns)) {
//       campaigns = [campaigns]; // Wrap in array to treat single object as an array
//     }

//     // Check if campaigns already exist in the database
//     for (const campaign of campaigns) {
//       // Adjust the query to check if the campaign already exists by its unique identifier (e.g., id)
//       const existingCampaign = await Campaign.findOne({ id: campaign.id });

//       // If the campaign already exists, skip it
//       if (existingCampaign) {
//         console.log(`Campaign with ID ${campaign.id} already exists, skipping.`);
//         continue;
//       }

//       // If the campaign doesn't exist, insert it into the database
//       await Campaign.create(campaign);
//     }

//     res.status(200).json({ message: "Campaigns saved successfully!" });
//   } catch (err) {
//     console.error("Error saving campaigns:", err);
//     res.status(500).json({ error: "Failed to save campaigns" });
//   }
// };

// const getCampaignsData = async (req, res) => {
//   try {
//     const { selectedAccount } = req.params; // Extract selectedAccount from URL parameters
//     console.log('Selected account:', selectedAccount);

//     // Query the database to find campaigns for the selectedAccount
//     const campaigns = await Campaign.find({ accountId: selectedAccount }); // Adjust the field name to match your schema
//     console.log('Fetched campaigns:', campaigns);

//     if (campaigns.length === 0) {
//       return res.status(404).json({ message: 'No campaigns found for the selected account' });
//     }

//     res.status(200).json(campaigns); // Return the filtered campaigns
//   } catch (error) {
//     console.error('Error fetching campaigns:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// //

// const updateCampaignsData = async (req, res) => {
//   const { selectedAccount } = req.params; // Extract account ID from the URL
//   const { accountName } = req.body; // Extract the updated data from the request body

//   try {
//     // Find the account by ID and update the fields
//     console.log('this is id',selectedAccount);

//     const updatedCampaign = await Campaign.findByIdAndUpdate(
//       selectedAccount,
//       { name :accountName,

//       },
//       { new: true } // This option ensures the updated document is returned
//     );

//     if (!updatedCampaign) {
//       return res.status(404).json({ message: "Account not found" });
//     }

//     // Respond with the updated account
//     res
//       .status(200)
//       .json({ message: "Account updated successfully", data: updatedCampaign });
//   } catch (error) {
//     console.error("Error updating account:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// module.exports = {
//   createCampaignsData,
//   getCampaignsData,
//   updateCampaignsData,
// };

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
    console.log("campaigns", campaigns);

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
        console.log(
          `Campaign with ID ${campaign.id} already exists, skipping.`
        );
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


// const createCampaignsData = async (req, res) => {
//   try {
//     let campaigns = [];

//     // Process JSON data from the request body (if any)
//     if (req.body && Object.keys(req.body).length > 0) {
//       campaigns = Array.isArray(req.body) ? req.body : [req.body];
//     }
//     console.log("campaigns", campaigns);

//     // Process Excel file (if uploaded)
//     if (req.file) {
//       const fileBuffer = req.file.buffer;

//       // Parse Excel file into JSON
//       const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//       const sheetName = workbook.SheetNames[0]; // Get the first sheet
//       const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//       // Add Excel data to campaigns array
//       campaigns = campaigns.concat(sheetData);
//     }

//     if (campaigns.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "No data provided in request body or file" });
//     }

//     // Insert or update campaigns into the database
//     for (const campaign of campaigns) {
//       const existingCampaign = await Campaign.findOne({ id: campaign.id });

//       if (existingCampaign) {
//         // Check if Facebook Status has changed
//         if (existingCampaign.FacebookStatus !== campaign.FacebookStatus) {
//           console.log(
//             `Updating status for Campaign ID ${campaign.id} from ${existingCampaign.FacebookStatus} to ${campaign.FacebookStatus}`
//           );
//           existingCampaign.FacebookStatus = campaign.FacebookStatus;
//           await existingCampaign.save();
//         } else {
//           console.log(`No status change for Campaign ID ${campaign.id}.`);
//         }
//       } else {
//         // Create new campaign if it doesn't exist
//         await Campaign.create(campaign);
//         console.log(`Created new campaign with ID ${campaign.id}`);
//       }
//     }

//     res.status(200).json({ message: "Campaigns saved/updated successfully!" });
//   } catch (err) {
//     console.error("Error saving campaigns:", err);
//     res.status(500).json({ error: "Failed to save campaigns" });
//   }
// };



const getCampaignsData = async (req, res) => {
  try {
    const { selectedAccount } = req.params; // Extract selectedAccount from URL parameters
    console.log("Selected account parameter:", selectedAccount);

    // Query the database to find campaigns for the selected account
    const campaigns = await Campaign.find({ account_id: selectedAccount }); // Ensure the field name matches your schema
    console.log("Fetched campaigns from DB:", campaigns);

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
    console.log("this is id", selectedAccount);

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
