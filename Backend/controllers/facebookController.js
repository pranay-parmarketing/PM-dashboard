const axios = require("axios");
const FacebookAdInsight = require("../models/Facebookinsight");
const Visitor = require("../models/Visitors");



// const fetchAndStoreFacebookInsights = async (req, res) => {
//   try {
//     const { access_token, appsecret_proof, start_date, end_date, account_id } = req.body;

//     console.log("Received Params:", { access_token, appsecret_proof, start_date, end_date, account_id });

//     if (!account_id || !access_token || !appsecret_proof || !start_date || !end_date) {
//       return res.status(400).json({ message: "Missing required parameters" });
//     }

//     const formattedStartDate = new Date(start_date).toISOString().split("T")[0];
//     const formattedEndDate = new Date(end_date).toISOString().split("T")[0];

//     if (new Date(formattedStartDate) > new Date(formattedEndDate)) {
//       return res.status(400).json({ message: "Invalid date range: start_date must be before or equal to end_date" });
//     }

//     // Fetch data directly from Facebook API
//     let facebookApiUrl = `https://graph.facebook.com/v17.0/act_${account_id}/insights?fields=campaign_id,campaign_name,spend,reach,impressions,frequency,ctr,cpp,cpc,cpm,cost_per_unique_click,clicks,inline_link_click_ctr,inline_link_clicks,adset_name,date_start,date_stop&level=adset&time_increment=1&limit=10000&time_range={"since":"${formattedStartDate}","until":"${formattedEndDate}"}&access_token=${access_token}&appsecret_proof=${appsecret_proof}`;

//     let allInsights = [];

//     do {
//       try {
//         const response = await axios.get(facebookApiUrl);
//         console.log("Facebook API Response Dates:", response.data.data.map(d => d.date_start));

//         if (response.data && response.data.data.length > 0) {
//           const bulkOperations = response.data.data.map(insight => ({
//             updateOne: {
//               filter: { 
//                 account_id,
//                 campaign_id: insight.campaign_id,
//                 adset_name: insight.adset_name,
//                 date_start: insight.date_start,
//               },
//               update: {
//                 $set: {
//                   account_id,
//                   start_date: formattedStartDate,
//                   end_date: formattedEndDate,
//                   date_start: insight.date_start,
//                   date_stop: insight.date_stop || formattedEndDate,
//                   ...insight,
//                 },
//               },
//               upsert: true, // Insert if not exist, update if exists
//             }
//           }));

//           // Save to DB
//           await FacebookAdInsight.bulkWrite(bulkOperations);

//           allInsights.push(...response.data.data);
//         }

//         // Check for next page
//         facebookApiUrl = response.data.paging?.next || null;
//       } catch (apiError) {
//         console.error("Error fetching from Facebook API:", apiError.response?.data || apiError.message);
//         facebookApiUrl = null; // Stop loop on error
//       }
//     } while (facebookApiUrl);

//     if (allInsights.length > 0) {
//       // Sort fetched data in ascending order before sending response
//       allInsights.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

//       return res.status(201).json({
//         message: "New Facebook Ad Insights fetched and stored successfully",
//         data: allInsights, // Send only fetched API data
//       });
//     } else {
//       return res.status(404).json({ message: "No data found for the given date range" });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Failed to fetch and store Facebook insights" });
//   }
// };

const fetchAndStoreFacebookInsights = async (req, res) => {
  try {
    const { access_token, appsecret_proof, start_date, end_date, account_id } = req.body;

    console.log("Received Params:", { access_token, appsecret_proof, start_date, end_date, account_id });

    if (!account_id || !access_token || !appsecret_proof || !start_date || !end_date) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const formattedStartDate = new Date(start_date).toISOString().split("T")[0];
    const formattedEndDate = new Date(end_date).toISOString().split("T")[0];

    if (new Date(formattedStartDate) > new Date(formattedEndDate)) {
      return res.status(400).json({ message: "Invalid date range: start_date must be before or equal to end_date" });
    }

    // Fetch data directly from Facebook API
    let facebookApiUrl = `https://graph.facebook.com/v17.0/act_${account_id}/insights?fields=campaign_id,campaign_name,spend,reach,impressions,frequency,ctr,cpp,cpc,cpm,cost_per_unique_click,clicks,inline_link_click_ctr,inline_link_clicks,adset_name,date_start,date_stop&level=adset&time_increment=1&limit=10000&time_range={"since":"${formattedStartDate}","until":"${formattedEndDate}"}&access_token=${access_token}&appsecret_proof=${appsecret_proof}`;

    let allInsights = [];

    do {
      try {
        const response = await axios.get(facebookApiUrl);
        console.log("Facebook API Response Dates:", response.data.data.map(d => d.date_start));

        if (response.data && response.data.data.length > 0) {
          const bulkOperations = response.data.data.map(insight => ({
            updateOne: {
              filter: { 
                account_id,
                campaign_id: insight.campaign_id,
                adset_name: insight.adset_name,
                date_start: insight.date_start,
              },
              update: {
                $set: {
                  account_id,
                  start_date: formattedStartDate,
                  end_date: formattedEndDate,
                  date_start: insight.date_start,
                  date_stop: insight.date_stop || formattedEndDate,
                  ...insight,
                },
              },
              upsert: true, // Insert if not exist, update if exists
            }
          }));

          // Save to DB
          await FacebookAdInsight.bulkWrite(bulkOperations);

          allInsights.push(...response.data.data);
        }

        // Check for next page
        facebookApiUrl = response.data.paging?.next || null;
      } catch (apiError) {
        console.error("Error fetching from Facebook API:", apiError.response?.data || apiError.message);
        facebookApiUrl = null; // Stop loop on error
      }
    } while (facebookApiUrl);

    if (allInsights.length > 0) {
      // Sort fetched data in ascending order before sending response
      allInsights.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

      // Fetch Visitor Data for the same date range
      const dates = allInsights.map((insight) => insight.date_start); // Extract dates from Facebook Insights
      const visitors = await Visitor.find({ date: { $in: dates } }); // Fetch visitor data for matching dates

      // Create a map of date to activeUsers
      const visitorMap = visitors.reduce((acc, visitor) => {
        acc[visitor.date] = visitor.activeUsers;
        return acc;
      }, {});

      // Merge Facebook Insights with Visitor Data
      const combinedData = allInsights.map((insight) => ({
        ...insight,
        activeUsers: visitorMap[insight.date_start] || 0, // Default to 0 if no visitor data is found
      }));

      return res.status(201).json({
        message: "New Facebook Ad Insights fetched and stored successfully",
        data: combinedData, // Send combined data with visitor counts
      });
    } else {
      return res.status(404).json({ message: "No data found for the given date range" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to fetch and store Facebook insights" });
  }
};

// const getFacebookInsights = async (req, res) => {
//   try {
//     const { account_id } = req.params;
//     const { page = 1, limit = 10 } = req.query; // Pagination parameters

//     if (!account_id) {
//       return res.status(400).json({ message: "Account ID is required" });
//     }

//     const skip = (page - 1) * limit;

//     const insights = await FacebookAdInsight.find({ account_id })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalCount = await FacebookAdInsight.countDocuments({ account_id });

//     if (insights.length === 0) {
//       return res.status(404).json({ message: "No insights found for this account" });
//     }

//     res.status(200).json({
//       message: "Insights retrieved successfully",
//       data: insights,
//       pagination: {
//         total: totalCount,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil(totalCount / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error retrieving Facebook Ads Insights:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

const getFacebookInsights = async (req, res) => {
  try {
    const { account_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Pagination parameters

    if (!account_id) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const skip = (page - 1) * limit;

    // Fetch Facebook Insights
    const insights = await FacebookAdInsight.find({ account_id })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await FacebookAdInsight.countDocuments({ account_id });

    if (insights.length === 0) {
      return res.status(404).json({ message: "No insights found for this account" });
    }

    // Fetch Visitor Data for the same date range
    const dates = insights.map((insight) => insight.date_start); // Extract dates from Facebook Insights
    const visitors = await Visitor.find({ date: { $in: dates } }); // Fetch visitor data for matching dates

    // Create a map of date to activeUsers
    const visitorMap = visitors.reduce((acc, visitor) => {
      acc[visitor.date] = visitor.activeUsers;
      return acc;
    }, {});

    // Merge Facebook Insights with Visitor Data
    const combinedData = insights.map((insight) => ({
      ...insight.toObject(),
      activeUsers: visitorMap[insight.date_start] || 0, // Default to 0 if no visitor data is found
    }));

    res.status(200).json({
      message: "Insights retrieved successfully",
      data: combinedData,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving Facebook Ads Insights:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
module.exports = {
  fetchAndStoreFacebookInsights,
  getFacebookInsights,
};