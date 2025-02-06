// const Lead = require("../models/Leads");
// const Ad = require("../models/Ads");
// const Adset = require("../models/Adset");

// const getSourceData = async (req, res) => {
//   try {
//     // Fetch all ads along with their adset names from the Ad collection
//     const ads = await Ad.find({}, "name adset.name");  // Fetch the 'name' and 'adset.name' fields from the Ad collection

//     // Extract ad names and adset names into arrays, trimming any extra whitespace
//     const adsTrimmed = ads.map(ad => ({
//       adname: ad.name.trim(),
//       adsetname: ad.adset?.name?.trim() || ""  // Ensure we handle cases where adset.name may be missing
//     }));

//     console.log("Ad Names Array with Adset Names:", adsTrimmed);

//     // Create an array to hold the result for each ad
//     const result = [];

//     // Loop through each ad object
//     for (let { adname, adsetname } of adsTrimmed) {
//       // Fetch leads where the source matches the current ad name
//       const leads = await Lead.find({ source: adname });

//       // Fetch the campaign name from the Adset collection based on the adsetname
//       const adset = await Adset.findOne({ name: adsetname });

//       // If adset is found, retrieve campaign_name; otherwise, set it to an empty string
//       const campaignName = adset ? adset.campaign_name : "";

//       // If leads exist, return them with adsetname and campaign_name. Otherwise, mark as "Organic"
//       if (leads.length > 0) {
//         result.push({
//           adsetname: adsetname,  // Return the adset name from the ad's adset
//           source: adname,        // Return the ad name as the source if leads are found
//           campaign_name: campaignName  // Include the campaign name from the Adset collection
//         });
//       } else {
//         result.push({
//           adsetname: adsetname,  // Return the adset name even if no leads are found
//           source: "Organic",    // No leads found, mark as "Organic"
//           campaign_name: campaignName  // Include the campaign name from the Adset collection
//         });
//       }
//     }

//     // Return the response with all ads and their respective source data
//     res.status(200).json({
//       leads: result,  // Return the result array
//       totalLeads: result.length,  // Total leads is the length of the array
//     });
//   } catch (error) {
//     console.error("Error occurred while fetching leads:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = {
//   getSourceData,
// };


const Lead = require("../models/Leads");
const Ad = require("../models/Ads");
const Adset = require("../models/Adset");

const getSourceData = async (req, res) => {
  try {
    const { accountId } = req.query;  // Extract accountId from query params

    if (!accountId) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    // Fetch ads for the selected account
    const ads = await Ad.find({ account_id: accountId }, "name adset.name");

    // Extract ad names and adset names
    const adsTrimmed = ads.map(ad => ({
      adname: ad.name.trim(),
      adsetname: ad.adset?.name?.trim() || ""
    }));

    const result = [];

    for (let { adname, adsetname } of adsTrimmed) {
      const leads = await Lead.find({ source: adname });

      const adset = await Adset.findOne({ name: adsetname });
      const campaignName = adset ? adset.campaign_name : "";

      result.push({
        adsetname,
        source: leads.length > 0 ? adname : "Organic",
        campaign_name: campaignName
      });
    }

    res.status(200).json({
      leads: result,
      totalLeads: result.length,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getSourceData,
};

