// const Campaign = require("../models/Campaign");
// const Adset = require("../models/Adset");
// const Ad = require("../models/Ads");
// const Expense = require("../models/Expense");
// const Visitor = require("../models/Visitors");
// const SourceData = require("../models/Source");

// // const getMarketingReport = async (req, res) => {
// //     try {
// //         console.log("Received request for marketing report");
// //         const { startDate, endDate, account_id, campaign_id, adset_id, ad_id } = req.query;

// //         // Validate required fields
// //         if (!startDate || !endDate || !account_id) {
// //             return res.status(400).json({
// //                 success: false,
// //                 message: "startDate, endDate, and account_id are required"
// //             });
// //         }

// //         console.log(`Fetching data for account: ${account_id} and date range: ${startDate} to ${endDate}`);

// //         // Fetch campaigns for the specific account
// //         const campaigns = await Campaign.find({
// //             start_time: { $gte: new Date(startDate) },
// //             account_id: account_id,
// //             ...(campaign_id && { _id: campaign_id }) // Filter by campaign_id if provided
// //         });
// //         console.log(`Fetched ${campaigns.length} campaigns for account ${account_id}`);

// //         // Fetch adsets for the campaigns
// //         const campaignIds = campaigns.map(campaign => campaign.id);
// //         const adsets = await Adset.find({
// //             campaign_id: { $in: campaignIds },
// //             account_id: account_id,
// //             ...(adset_id && { _id: adset_id }) // Filter by adset_id if provided
// //         });
// //         console.log(`Fetched ${adsets.length} adsets for account ${account_id}`);

// //         // Fetch ads for the adsets
// //         const adsetIds = adsets.map(adset => adset.id);
// //         const ads = await Ad.find({
// //             adset_id: { $in: adsetIds },
// //             account_id: account_id,
// //             ...(ad_id && { _id: ad_id }) // Filter by ad_id if provided
// //         });
// //         console.log(`Fetched ${ads.length} ads for account ${account_id}`);

// //         // Fetch expenses for the adsets
// //         const expenses = await Expense.find({
// //             "adsets.id": { $in: adsetIds },
// //             account_id: account_id
// //         });
// //         console.log(`Fetched ${expenses.length} expenses for account ${account_id}`);

// //         // Fetch visitors for the date range
// //         const visitors = await Visitor.find({
// //             date: { $gte: startDate, $lte: endDate },
// //             account_id: account_id
// //         });
// //         console.log(`Fetched ${visitors.length} visitor records for account ${account_id}`);

// //         // Fetch source data for the account
// //         const sourceData = await SourceData.find({
// //             account_id: account_id
// //         });
// //         console.log(`Fetched ${sourceData.length} source records for account ${account_id}`);

// //         // Generate report
// //         const report = campaigns.map(campaign => {
// //             const campaignAdsets = adsets.filter(adset => adset.campaign_id === campaign.id);
// //             const campaignAds = ads.filter(ad => campaignAdsets.some(adset => ad.adset_id === adset.id));
// //             const campaignExpenses = expenses.filter(expense => expense.adsets.some(adset => adset.id === campaign.id));
// //             const campaignSources = sourceData.filter(source => source.campaign_name === campaign.name);

// //             // Calculate metrics
// //             const totalSpend = campaignAdsets.reduce((sum, adset) => sum + (adset.spend || 0), 0);
// //             const totalImpressions = campaignAdsets.reduce((sum, adset) => sum + (adset.impressions || 0), 0);
// //             const totalReach = campaignAdsets.reduce((sum, adset) => sum + (adset.reach || 0), 0);
// //             const totalConversions = campaignAdsets.reduce((sum, adset) => sum + (adset.conversions || 0), 0);
// //             const avgCPC = totalSpend > 0 ? (totalSpend / (totalImpressions || 1)).toFixed(2) : 0;
// //             const totalVisitors = visitors.reduce((sum, visitor) => sum + (parseInt(visitor.activeUsers) || 0), 0);

// //             // Include adset details
// //             const adsetDetails = campaignAdsets.map(adset => ({
// //                 adset_id: adset.id,
// //                 adset_name: adset.name,
// //                 start_time: adset.start_time,
// //                 end_time: adset.end_time,
// //                 daily_budget: adset.daily_budget,
// //                 status: adset.status,
// //                 spend: adset.spend,
// //                 impressions: adset.impressions,
// //                 reach: adset.reach,
// //                 conversions: adset.conversions,
// //                 cpc: adset.cpc,
// //                 cpm: adset.cpm,
// //                 created_at: adset.createdAt, // Include created date of adset
// //             }));

// //             return {
// //                 campaign_id: campaign.id,
// //                 campaign_name: campaign.name,
// //                 status: campaign.status,
// //                 start_time: campaign.start_time, // Campaign start date
// //                 end_time: campaign.end_time, // Campaign end date (if available)
// //                 created_at: campaign.createdAt, // Include created date of campaign
// //                 total_spend: totalSpend,
// //                 total_impressions: totalImpressions,
// //                 total_reach: totalReach,
// //                 total_conversions: totalConversions,
// //                 avg_cpc: avgCPC,
// //                 total_visitors: totalVisitors,
// //                 source_count: campaignSources.length,
// //                 adsets: adsetDetails, // Include adset details
// //                 ads: campaignAds.map(ad => ({
// //                     ad_id: ad.id,
// //                     ad_name: ad.name,
// //                     ad_status: ad.status,
// //                     created_at: ad.createdAt, // Include created date of ad
// //                 }))
// //             };
// //         });

// //         console.log("Marketing report generated successfully");
// //         res.json({ success: true, totalRecords: report.length, data: report });

// //     } catch (error) {
// //         console.error("Error generating marketing report:", error);
// //         res.status(500).json({ success: false, message: "Internal Server Error" });
// //     }
// // };

// // module.exports = { getMarketingReport };

// const getMarketingReport = async (req, res) => {
//     try {
//         console.log("Received request for marketing report");
//         const { startDate, endDate, account_id, filterType } = req.query;

//         // Validate required fields
//         if (!startDate || !endDate || !account_id || !filterType) {
//             return res.status(400).json({
//                 success: false,
//                 message: "startDate, endDate, account_id, and filterType are required"
//             });
//         }

//         console.log(`Fetching data for account: ${account_id}, date range: ${startDate} to ${endDate}, and filter type: ${filterType}`);

//         let report = [];

//         if (filterType === "campaign") {
//             // Fetch campaigns for the specific account and date range
//             const campaigns = await Campaign.find({
//                 start_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${campaigns.length} campaigns for account ${account_id}`);

//             // Generate report for campaigns
//             report = campaigns.map(campaign => ({
//                 campaign_id: campaign.id,
//                 campaign_name: campaign.name,
//                 status: campaign.status,
//                 start_time: campaign.start_time,
//                 end_time: campaign.end_time,
//                 created_at: campaign.createdAt,
//             }));
//         } else if (filterType === "adset") {
//             // Fetch adsets for the specific account and date range
//             const adsets = await Adset.find({
//                 start_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${adsets.length} adsets for account ${account_id}`);

//             // Generate report for adsets
//             report = adsets.map(adset => ({
//                 adset_id: adset.id,
//                 adset_name: adset.name,
//                 campaign_id: adset.campaign_id,
//                 start_time: adset.start_time,
//                 end_time: adset.end_time,
//                 daily_budget: adset.daily_budget,
//                 status: adset.status,
//                 created_at: adset.createdAt,
//             }));
//         } else if (filterType === "ads") {
//             // Fetch ads for the specific account and date range
//             const ads = await Ad.find({
//                 created_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${ads.length} ads for account ${account_id}`);

//             // Generate report for ads
//             report = ads.map(ad => ({
//                 ad_id: ad.id,
//                 ad_name: ad.name,
//                 adset_id: ad.adset_id,
//                 status: ad.status,
//                 created_at: ad.createdAt,
//             }));
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid filterType. Use 'campaign', 'adset', or 'ads'."
//             });
//         }

//         console.log("Marketing report generated successfully");
//         res.json({ success: true, totalRecords: report.length, data: report });

//     } catch (error) {
//         console.error("Error generating marketing report:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// module.exports = { getMarketingReport };

//

// const Campaign = require("../models/Campaign");
// const Adset = require("../models/Adset");
// const Ad = require("../models/Ads");
// const Expense = require("../models/Expense");
// const Visitor = require("../models/Visitors");
// const SourceData = require("../models/Source");
// const FacebookAdInsight = require("../models/Facebookinsight");

// const getMarketingReport = async (req, res) => {
//     try {
//         console.log("Received request for marketing report");
//         const { startDate, endDate, account_id, filterType } = req.query;

//         // Validate required fields
//         if (!startDate || !endDate || !account_id || !filterType) {
//             return res.status(400).json({
//                 success: false,
//                 message: "startDate, endDate, account_id, and filterType are required"
//             });
//         }

//         console.log(`Fetching data for account: ${account_id}, date range: ${startDate} to ${endDate}, and filter type: ${filterType}`);

//         let report = [];

//         if (filterType === "campaign") {
//             // Fetch campaigns for the specific account and date range
//             const campaigns = await Campaign.find({
//                 start_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${campaigns.length} campaigns for account ${account_id}`);

//             // Fetch adsets for the campaigns
//             const campaignIds = campaigns.map(campaign => campaign.id);
//             const adsets = await Adset.find({
//                 campaign_id: { $in: campaignIds },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${adsets.length} adsets for account ${account_id}`);

//             // Fetch ads for the adsets
//             const adsetIds = adsets.map(adset => adset.id);
//             const ads = await Ad.find({
//                 adset_id: { $in: adsetIds },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${ads.length} ads for account ${account_id}`);

//             // Fetch expenses for the adsets
//             const expenses = await Expense.find({
//                 "adsets.id": { $in: adsetIds },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${expenses.length} expenses for account ${account_id}`);

//             // Fetch visitors for the date range
//             const visitors = await Visitor.find({
//                 date: { $gte: startDate, $lte: endDate },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${visitors.length} visitor records for account ${account_id}`);

//             // Fetch source data for the account
//             const sourceData = await SourceData.find({
//                 account_id: account_id
//             });
//             console.log(`Fetched ${sourceData.length} source records for account ${account_id}`);

//             // Fetch FacebookAdInsight data for the campaigns
//             const facebookInsights = await FacebookAdInsight.find({
//                 account_id: account_id,
//                 date_start: { $gte: startDate, $lte: endDate },
//                 campaign_id: { $in: campaignIds },
//             });
//             console.log(`Fetched ${facebookInsights.length} Facebook insights for account ${account_id}`);

//             // Generate report for campaigns
//             report = campaigns.map(campaign => {
//                 const campaignAdsets = adsets.filter(adset => adset.campaign_id === campaign.id);
//                 const campaignAds = ads.filter(ad => campaignAdsets.some(adset => ad.adset_id === adset.id));
//                 const campaignExpenses = expenses.filter(expense => expense.adsets.some(adset => adset.id === campaign.id));
//                 const campaignSources = sourceData.filter(source => source.campaign_name === campaign.name);

//                 // Fetch Facebook insights for the campaign
//                 const campaignInsights = facebookInsights.filter(insight => insight.campaign_id === campaign.id);

//                 // Calculate metrics from Facebook insights
//                 const totalSpend = campaignInsights.reduce((sum, insight) => sum + (insight.spend || 0), 0);
//                 const totalImpressions = campaignInsights.reduce((sum, insight) => sum + (insight.impressions || 0), 0);
//                 const totalReach = campaignInsights.reduce((sum, insight) => sum + (insight.reach || 0), 0);
//                 const totalConversions = campaignInsights.reduce((sum, insight) => sum + (insight.clicks || 0), 0); // Assuming clicks as conversions
//                 const avgCPC = totalSpend > 0 ? (totalSpend / (totalConversions || 1)).toFixed(2) : 0;

//                 // Calculate visitors
//                 const totalVisitors = visitors.reduce((sum, visitor) => sum + (parseInt(visitor.activeUsers) || 0), 0);

//                 // Include adset details
//                 const adsetDetails = campaignAdsets.map(adset => ({
//                     adset_id: adset.id,
//                     adset_name: adset.name,
//                     start_time: adset.start_time,
//                     end_time: adset.end_time,
//                     daily_budget: adset.daily_budget,
//                     status: adset.status,
//                     spend: adset.spend,
//                     impressions: adset.impressions,
//                     reach: adset.reach,
//                     conversions: adset.conversions,
//                     cpc: adset.cpc,
//                     cpm: adset.cpm,
//                     created_at: adset.createdAt,
//                 }));

//                 return {
//                     campaign_id: campaign.id,
//                     campaign_name: campaign.name,
//                     status: campaign.status,
//                     start_time: campaign.start_time,
//                     end_time: campaign.end_time,
//                     created_at: campaign.createdAt,
//                     total_spend: totalSpend,
//                     total_impressions: totalImpressions,
//                     total_reach: totalReach,
//                     total_conversions: totalConversions,
//                     avg_cpc: avgCPC,
//                     total_visitors: totalVisitors,
//                     source_count: campaignSources.length,
//                     sources: campaignSources.map(source => ({
//                         source: source.source,
//                         adset_name: source.adset_name,
//                         campaign_name: source.campaign_name,
//                     })),
//                     adsets: adsetDetails,
//                     ads: campaignAds.map(ad => ({
//                         ad_id: ad.id,
//                         ad_name: ad.name,
//                         ad_status: ad.status,
//                         created_at: ad.createdAt,
//                     })),
//                 };
//             });
//         } else if (filterType === "adset") {
//             // Fetch adsets for the specific account and date range
//             const adsets = await Adset.find({
//                 start_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${adsets.length} adsets for account ${account_id}`);

//             // Fetch ads for the adsets
//             const adsetIds = adsets.map(adset => adset.id);
//             const ads = await Ad.find({
//                 adset_id: { $in: adsetIds },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${ads.length} ads for account ${account_id}`);

//             // Fetch expenses for the adsets
//             const expenses = await Expense.find({
//                 "adsets.id": { $in: adsetIds },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${expenses.length} expenses for account ${account_id}`);

//             // Fetch visitors for the date range
//             const visitors = await Visitor.find({
//                 date: { $gte: startDate, $lte: endDate },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${visitors.length} visitor records for account ${account_id}`);

//             // Fetch source data for the account
//             const sourceData = await SourceData.find({
//                 account_id: account_id
//             });
//             console.log(`Fetched ${sourceData.length} source records for account ${account_id}`);

//             // Fetch FacebookAdInsight data for the adsets
//             const facebookInsights = await FacebookAdInsight.find({
//                 account_id: account_id,
//                 date_start: { $gte: startDate, $lte: endDate },
//                 adset_name: { $in: adsets.map(adset => adset.name) },
//             });
//             console.log(`Fetched ${facebookInsights.length} Facebook insights for account ${account_id}`);

//             // Generate report for adsets
//             report = adsets.map(adset => {
//                 const adsetAds = ads.filter(ad => ad.adset_id === adset.id);
//                 const adsetExpenses = expenses.filter(expense => expense.adsets.some(adset => adset.id === adset.id));
//                 const adsetSources = sourceData.filter(source => source.adset_name === adset.name);

//                 // Fetch Facebook insights for the adset
//                 const adsetInsights = facebookInsights.filter(insight => insight.adset_name === adset.name);

//                 // Calculate metrics from Facebook insights
//                 const totalSpend = adsetInsights.reduce((sum, insight) => sum + (insight.spend || 0), 0);
//                 const totalImpressions = adsetInsights.reduce((sum, insight) => sum + (insight.impressions || 0), 0);
//                 const totalReach = adsetInsights.reduce((sum, insight) => sum + (insight.reach || 0), 0);
//                 const totalConversions = adsetInsights.reduce((sum, insight) => sum + (insight.clicks || 0), 0); // Assuming clicks as conversions
//                 const avgCPC = totalSpend > 0 ? (totalSpend / (totalConversions || 1)).toFixed(2) : 0;

//                 // Calculate visitors
//                 const totalVisitors = visitors.reduce((sum, visitor) => sum + (parseInt(visitor.activeUsers) || 0), 0);

//                 return {
//                     adset_id: adset.id,
//                     adset_name: adset.name,
//                     campaign_id: adset.campaign_id,
//                     start_time: adset.start_time,
//                     end_time: adset.end_time,
//                     daily_budget: adset.daily_budget,
//                     status: adset.status,
//                     created_at: adset.createdAt,
//                     total_spend: totalSpend,
//                     total_impressions: totalImpressions,
//                     total_reach: totalReach,
//                     total_conversions: totalConversions,
//                     avg_cpc: avgCPC,
//                     total_visitors: totalVisitors,
//                     source_count: adsetSources.length,
//                     sources: adsetSources.map(source => ({
//                         source: source.source,
//                         adset_name: source.adset_name,
//                         campaign_name: source.campaign_name,
//                     })),
//                     ads: adsetAds.map(ad => ({
//                         ad_id: ad.id,
//                         ad_name: ad.name,
//                         ad_status: ad.status,
//                         created_at: ad.createdAt,
//                     })),
//                 };
//             });
//         } else if (filterType === "ads") {
//             // Fetch ads for the specific account and date range
//             const ads = await Ad.find({
//                 created_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${ads.length} ads for account ${account_id}`);

//             // Fetch expenses for the ads
//             const adIds = ads.map(ad => ad.id);
//             const expenses = await Expense.find({
//                 "adsets.ads.id": { $in: adIds },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${expenses.length} expenses for account ${account_id}`);

//             // Fetch visitors for the date range
//             const visitors = await Visitor.find({
//                 date: { $gte: startDate, $lte: endDate },
//                 account_id: account_id
//             });
//             console.log(`Fetched ${visitors.length} visitor records for account ${account_id}`);

//             // Fetch source data for the account
//             const sourceData = await SourceData.find({
//                 account_id: account_id
//             });
//             console.log(`Fetched ${sourceData.length} source records for account ${account_id}`);

//             // Fetch FacebookAdInsight data for the ads
//             const facebookInsights = await FacebookAdInsight.find({
//                 account_id: account_id,
//                 date_start: { $gte: startDate, $lte: endDate },
//                 ad_name: { $in: ads.map(ad => ad.name) },
//             });
//             console.log(`Fetched ${facebookInsights.length} Facebook insights for account ${account_id}`);

//             // Generate report for ads
//             report = ads.map(ad => {
//                 const adExpenses = expenses.filter(expense => expense.adsets.some(adset => adset.ads.some(ad => ad.id === ad.id)));
//                 const adSources = sourceData.filter(source => source.source === ad.name);

//                 // Fetch Facebook insights for the ad
//                 const adInsights = facebookInsights.filter(insight => insight.ad_name === ad.name);

//                 // Calculate metrics from Facebook insights
//                 const totalSpend = adInsights.reduce((sum, insight) => sum + (insight.spend || 0), 0);
//                 const totalImpressions = adInsights.reduce((sum, insight) => sum + (insight.impressions || 0), 0);
//                 const totalReach = adInsights.reduce((sum, insight) => sum + (insight.reach || 0), 0);
//                 const totalConversions = adInsights.reduce((sum, insight) => sum + (insight.clicks || 0), 0); // Assuming clicks as conversions
//                 const avgCPC = totalSpend > 0 ? (totalSpend / (totalConversions || 1)).toFixed(2) : 0;

//                 // Calculate visitors
//                 const totalVisitors = visitors.reduce((sum, visitor) => sum + (parseInt(visitor.activeUsers) || 0), 0);

//                 return {
//                     ad_id: ad.id,
//                     ad_name: ad.name,
//                     adset_id: ad.adset_id,
//                     status: ad.status,
//                     created_at: ad.createdAt,
//                     total_spend: totalSpend,
//                     total_impressions: totalImpressions,
//                     total_reach: totalReach,
//                     total_conversions: totalConversions,
//                     avg_cpc: avgCPC,
//                     total_visitors: totalVisitors,
//                     source_count: adSources.length,
//                     sources: adSources.map(source => ({
//                         source: source.source,
//                         adset_name: source.adset_name,
//                         campaign_name: source.campaign_name,
//                     })),
//                 };
//             });
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid filterType. Use 'campaign', 'adset', or 'ads'."
//             });
//         }

//         console.log("Marketing report generated successfully");
//         res.json({ success: true, totalRecords: report.length, data: report });

//     } catch (error) {
//         console.error("Error generating marketing report:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// module.exports = { getMarketingReport };

// above is working-properly below is wip

const Campaign = require("../models/Campaign");
const Adset = require("../models/Adset");
const Ad = require("../models/Ads");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Lead = require("../models/Leads");
const Packsent = require("../models/Packsent");
const Enroll = require("../models/Enrollee");
const DMP = require("../models/Dmp");
const Visitor = require("../models/Visitors");
const SourceData = require("../models/Source");
const FacebookAdInsight = require("../models/Facebookinsight");

const getMarketingReport = async (req, res) => {
  try {
    const { startDate, endDate, account_id, filterType } = req.query;

    // Validate required fields
    if (!startDate || !endDate || !account_id || !filterType) {
      return res.status(400).json({
        success: false,
        message: "startDate, endDate, account_id, and filterType are required",
      });
    }

    let report = [];

    // Fetch day-wise counts for leads, packsent, and enrolls
    const leadsByDay = await Lead.aggregate([
      {
        $match: {
          createdOn: { $gte: startDate, $lte: endDate }, // Direct string comparison
        },
      },
      {
        $group: {
          _id: "$createdOn", // Use createdOn directly as it's already a string
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const packsentByDay = await Packsent.aggregate([
      {
        $match: {
          sentDate: { $gte: startDate, $lte: endDate }, // Directly use string comparison
        },
      },
      {
        $group: {
          _id: "$sentDate", // Since sentDate is already a string, use it directly
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dmpsByDay = await DMP.aggregate([
      {
        $match: {
          createdAt: { $exists: true }, // Ensure createdAt exists
          first_disposition: "Explained DMP", // Filter only "Explained DMP"
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } // Match date range
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
          count: { $sum: 1 }, // Count documents
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);
    
    

    const enrollsByDay = await Enroll.aggregate([
      {
        $match: {
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
console.log('enrollsByDay',enrollsByDay)
    // Calculate total counts for leads, packsent, and enrolls
    const totalLeads = leadsByDay.reduce((sum, day) => sum + day.count, 0);
    const totalPacksent = packsentByDay.reduce(
      (sum, day) => sum + day.count,
      0
    );
    const totalEnrolls = enrollsByDay.reduce((sum, day) => sum + day.count, 0);
    const totalDmp = dmpsByDay.reduce((sum, day) => sum + day.count, 0);

    console.log("Leads by day:", leadsByDay);
    console.log("Packsent by day:", packsentByDay);
    console.log("Enrolls by day:", enrollsByDay);
    console.log("Total Leads:", totalLeads);
    console.log("Total Packsent:", totalPacksent);
    console.log("Total Enrolls:", totalEnrolls);
    console.log("Total DMP:", totalDmp);

    if (filterType === "campaign") {
      // Fetch campaigns for the specific account and date range
      const campaigns = await Campaign.find({
        start_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        account_id: account_id,
      });

      // Fetch adsets for the campaigns
      const campaignIds = campaigns.map((campaign) => campaign.id);
      const adsets = await Adset.find({
        campaign_id: { $in: campaignIds },
        account_id: account_id,
      });

      // Fetch ads for the adsets
      const adsetIds = adsets.map((adset) => adset.id);
      const ads = await Ad.find({
        adset_id: { $in: adsetIds },
        account_id: account_id,
      });

      // Fetch expenses for the adsets
      const expenses = await Expense.find({
        "adsets.id": { $in: adsetIds },
        account_id: account_id,
      });

      // Fetch visitors for the date range
      const visitors = await Visitor.find({
        date: { $gte: startDate, $lte: endDate },
        account_id: account_id,
      });

      // Fetch source data for the account
      const sourceData = await SourceData.find({
        account_id: account_id,
      });

      // Fetch FacebookAdInsight data for the campaigns
      const facebookInsights = await FacebookAdInsight.find({
        account_id: account_id,
        date_start: { $gte: startDate, $lte: endDate },
        campaign_id: { $in: campaignIds },
      });

      // Generate report for campaigns
      report = campaigns.map((campaign) => {
        const campaignAdsets = adsets.filter(
          (adset) => adset.campaign_id === campaign.id
        );
        const campaignAds = ads.filter((ad) =>
          campaignAdsets.some((adset) => ad.adset_id === adset.id)
        );
        const campaignExpenses = expenses.filter((expense) =>
          expense.adsets.some((adset) => adset.id === campaign.id)
        );
        const campaignSources = sourceData.filter(
          (source) => source.campaign_name === campaign.name
        );

        // Fetch Facebook insights for the campaign
        const campaignInsights = facebookInsights.filter(
          (insight) => insight.campaign_id === campaign.id
        );

        // Calculate metrics from Facebook insights
        const totalSpend = campaignInsights.reduce(
          (sum, insight) => sum + (insight.spend || 0),
          0
        );
        const totalImpressions = campaignInsights.reduce(
          (sum, insight) => sum + (insight.impressions || 0),
          0
        );
        const totalReach = campaignInsights.reduce(
          (sum, insight) => sum + (insight.reach || 0),
          0
        );
        const totalConversions = campaignInsights.reduce(
          (sum, insight) => sum + (insight.clicks || 0),
          0
        ); // Assuming clicks as conversions
        const avgCPC =
          totalSpend > 0
            ? (totalSpend / (totalConversions || 1)).toFixed(2)
            : 0;

        // Calculate visitors
        const totalVisitors = visitors.reduce(
          (sum, visitor) => sum + (parseInt(visitor.activeUsers) || 0),
          0
        );

        // Include adset details
        const adsetDetails = campaignAdsets.map((adset) => ({
          adset_id: adset.id,
          adset_name: adset.name,
          start_time: adset.start_time,
          end_time: adset.end_time,
          daily_budget: adset.daily_budget,
          status: adset.status,
          spend: adset.spend,
          impressions: adset.impressions,
          reach: adset.reach,
          conversions: adset.conversions,
          cpc: adset.cpc,
          cpm: adset.cpm,
          created_at: adset.createdAt,
        }));

        return {
          campaign_id: campaign.id,
          leadsByDay,
          packsentByDay,
          enrollsByDay,
          dmpsByDay,
          totalLeads,
          totalPacksent,
          totalEnrolls,
          campaign_name: campaign.name,
          status: campaign.status,
          start_time: campaign.start_time,
          end_time: campaign.end_time,
          created_at: campaign.createdAt,
          total_spend: totalSpend,
          total_impressions: totalImpressions,
          total_reach: totalReach,
          total_conversions: totalConversions,
          avg_cpc: avgCPC,
          total_visitors: totalVisitors,
          source_count: campaignSources.length,
          sources: campaignSources.map((source) => ({
            source: source.source,
            adset_name: source.adset_name,
            campaign_name: source.campaign_name,
          })),
          adsets: adsetDetails,
          ads: campaignAds.map((ad) => ({
            ad_id: ad.id,
            ad_name: ad.name,
            ad_status: ad.status,
            created_at: ad.createdAt,
          })),
        };
      });
    } else if (filterType === "adset") {
      // Fetch adsets for the specific account and date range
      const adsets = await Adset.find({
        start_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        account_id: account_id,
      });

      // Fetch ads for the adsets
      const adsetIds = adsets.map((adset) => adset.id);
      const ads = await Ad.find({
        adset_id: { $in: adsetIds },
        account_id: account_id,
      });

      // Fetch expenses for the adsets
      const expenses = await Expense.find({
        "adsets.id": { $in: adsetIds },
        account_id: account_id,
      });

      // Fetch visitors for the date range
      const visitors = await Visitor.find({
        date: { $gte: startDate, $lte: endDate },
        account_id: account_id,
      });

      // Fetch source data for the account
      const sourceData = await SourceData.find({
        account_id: account_id,
      });

      // Fetch FacebookAdInsight data for the adsets
      const facebookInsights = await FacebookAdInsight.find({
        account_id: account_id,
        date_start: { $gte: startDate, $lte: endDate },
        adset_name: { $in: adsets.map((adset) => adset.name) },
      });

      // Generate report for adsets
      report = adsets.map((adset) => {
        const adsetAds = ads.filter((ad) => ad.adset_id === adset.id);
        const adsetExpenses = expenses.filter((expense) =>
          expense.adsets.some((adset) => adset.id === adset.id)
        );
        const adsetSources = sourceData.filter(
          (source) => source.adset_name === adset.name
        );

        // Fetch Facebook insights for the adset
        const adsetInsights = facebookInsights.filter(
          (insight) => insight.adset_name === adset.name
        );

        // Calculate metrics from Facebook insights
        const totalSpend = adsetInsights.reduce(
          (sum, insight) => sum + (insight.spend || 0),
          0
        );
        const totalImpressions = adsetInsights.reduce(
          (sum, insight) => sum + (insight.impressions || 0),
          0
        );
        const totalReach = adsetInsights.reduce(
          (sum, insight) => sum + (insight.reach || 0),
          0
        );
        const totalConversions = adsetInsights.reduce(
          (sum, insight) => sum + (insight.clicks || 0),
          0
        ); // Assuming clicks as conversions
        const avgCPC =
          totalSpend > 0
            ? (totalSpend / (totalConversions || 1)).toFixed(2)
            : 0;

        // Calculate visitors
        const totalVisitors = visitors.reduce(
          (sum, visitor) => sum + (parseInt(visitor.activeUsers) || 0),
          0
        );

        return {
          adset_id: adset.id,
          adset_name: adset.name,
          campaign_id: adset.campaign_id,
          start_time: adset.start_time,
          end_time: adset.end_time,
          daily_budget: adset.daily_budget,
          status: adset.status,
          created_at: adset.createdAt,
          total_spend: totalSpend,
          total_impressions: totalImpressions,
          total_reach: totalReach,
          total_conversions: totalConversions,
          avg_cpc: avgCPC,
          total_visitors: totalVisitors,
          source_count: adsetSources.length,
          sources: adsetSources.map((source) => ({
            source: source.source,
            adset_name: source.adset_name,
            campaign_name: source.campaign_name,
          })),
          ads: adsetAds.map((ad) => ({
            ad_id: ad.id,
            ad_name: ad.name,
            ad_status: ad.status,
            created_at: ad.createdAt,
          })),
        };
      });
    } else if (filterType === "ads") {
      // Fetch ads for the specific account and date range
      const ads = await Ad.find({
        created_time: { $gte: new Date(startDate), $lte: new Date(endDate) },
        account_id: account_id,
      });

      // Fetch expenses for the ads
      const adIds = ads.map((ad) => ad.id);
      const expenses = await Expense.find({
        "adsets.ads.id": { $in: adIds },
        account_id: account_id,
      });

      // Fetch visitors for the date range
      const visitors = await Visitor.find({
        date: { $gte: startDate, $lte: endDate },
        account_id: account_id,
      });

      // Fetch source data for the account
      const sourceData = await SourceData.find({
        account_id: account_id,
      });

      // Fetch FacebookAdInsight data for the ads
      const facebookInsights = await FacebookAdInsight.find({
        account_id: account_id,
        date_start: { $gte: startDate, $lte: endDate },
        ad_name: { $in: ads.map((ad) => ad.name) },
      });

      // Generate report for ads
      report = ads.map((ad) => {
        const adExpenses = expenses.filter((expense) =>
          expense.adsets.some((adset) =>
            adset.ads.some((ad) => ad.id === ad.id)
          )
        );
        const adSources = sourceData.filter(
          (source) => source.source === ad.name
        );

        // Fetch Facebook insights for the ad
        const adInsights = facebookInsights.filter(
          (insight) => insight.ad_name === ad.name
        );

        // Calculate metrics from Facebook insights
        const totalSpend = adInsights.reduce(
          (sum, insight) => sum + (insight.spend || 0),
          0
        );
        const totalImpressions = adInsights.reduce(
          (sum, insight) => sum + (insight.impressions || 0),
          0
        );
        const totalReach = adInsights.reduce(
          (sum, insight) => sum + (insight.reach || 0),
          0
        );
        const totalConversions = adInsights.reduce(
          (sum, insight) => sum + (insight.clicks || 0),
          0
        ); // Assuming clicks as conversions
        const avgCPC =
          totalSpend > 0
            ? (totalSpend / (totalConversions || 1)).toFixed(2)
            : 0;

        // Calculate visitors
        const totalVisitors = visitors.reduce(
          (sum, visitor) => sum + (parseInt(visitor.activeUsers) || 0),
          0
        );

        return {
          ad_id: ad.id,
          ad_name: ad.name,
          adset_id: ad.adset_id,
          status: ad.status,
          created_at: ad.createdAt,
          total_spend: totalSpend,
          total_impressions: totalImpressions,
          total_reach: totalReach,
          total_conversions: totalConversions,
          avg_cpc: avgCPC,
          total_visitors: totalVisitors,
          source_count: adSources.length,
          sources: adSources.map((source) => ({
            source: source.source,
            adset_name: source.adset_name,
            campaign_name: source.campaign_name,
          })),
        };
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid filterType. Use 'campaign', 'adset', or 'ads'.",
      });
    }

    res.json({
      success: true,
      totalRecords: report.length,
      data: report,
      totals: {
        totalLeads,
        totalPacksent,
        totalEnrolls,
      },
    });
  } catch (error) {
    console.error("Error generating marketing report:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getMarketingReport };
