// const Lead = require("../models/Leads");
// const Ad = require("../models/Ads");
// const Adset = require("../models/Adset");

// const getSourceData = async (req, res) => {
//   try {
//     const { accountId } = req.query;  

//     if (!accountId) {
//       return res.status(400).json({ error: "Account ID is required" });
//     }

//     // Fetch ads for the selected account
//     const ads = await Ad.find({ account_id: accountId }, "name adset.name");

//     // Extract ad names and adset names
//     const adsTrimmed = ads.map(ad => ({
//       adname: ad.name.trim(),
//       adsetname: ad.adset?.name?.trim() || ""
//     }));

//     const result = [];

//     for (let { adname, adsetname } of adsTrimmed) {
//       const leads = await Lead.find({ source: adname });

//       const adset = await Adset.findOne({ name: adsetname });
//       const campaignName = adset ? adset.campaign_name : "";

//       result.push({
//         adsetname,
//         source: leads.length > 0 ? adname : "Organic",
//         campaign_name: campaignName
//       });
//     }

//     res.status(200).json({
//       leads: result,
//       totalLeads: result.length,
//     });
//   } catch (error) {
//     console.error("Error fetching leads:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// module.exports = {
//   getSourceData,
// };


const Lead = require("../models/Leads");
const Ad = require("../models/Ads");
const Adset = require("../models/Adset");
const SourceData = require("../models/Source"); // Import the SourceData model

const getSourceData = async (req, res) => {
  try {
    const { accountId } = req.query;

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

      const sourceData = {
        account_id: accountId, // Include account ID
        adset_name: adsetname,
        source: leads.length > 0 ? adname : "Organic",
        campaign_name: campaignName,
      };

      // Save to the database
      await SourceData.create(sourceData);

      result.push(sourceData);
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
