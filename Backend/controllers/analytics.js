// const { BetaAnalyticsDataClient } = require("@google-analytics/data");
// const Visitor = require("../models/Visitors");
// const cron = require("node-cron"); // Import node-cron
// require("dotenv").config();

// const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// const analyticsDataClient = new BetaAnalyticsDataClient({
//   credentials: credentials,
// });

// const PROPERTY_ID = "265067350";

// // Function to fetch and store analytics data
// const fetchAndStoreAnalyticsData = async () => {
//   try {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1); // Get yesterday's date
//     const formattedDate = yesterday.toISOString().split("T")[0];

//     const [response] = await analyticsDataClient.runReport({
//       property: `properties/${PROPERTY_ID}`,
//       dateRanges: [{ startDate: formattedDate, endDate: formattedDate }],
//       metrics: [{ name: "activeUsers" }],
//       dimensions: [{ name: "date" }],
//     });

//     if (!response.rows.length) {
//       console.log(`No data available for ${formattedDate}`);
//       return;
//     }

//     const row = response.rows[0];
//     const rawDate = row.dimensionValues[0]?.value || "Unknown";
//     const year = rawDate.slice(0, 4);
//     const month = rawDate.slice(4, 6);
//     const day = rawDate.slice(6, 8);
//     const formattedAnalyticsDate = `${year}-${month}-${day}`;
//     const activeUsers = row.metricValues[0]?.value || "0";

//     // Store data in MongoDB
//     await Visitor.findOneAndUpdate(
//       { date: formattedAnalyticsDate },
//       { activeUsers: activeUsers },
//       { upsert: true, new: true }
//     );

//     console.log(`✅ Data saved for ${formattedAnalyticsDate}: ${activeUsers} active users`);
//   } catch (error) {
//     console.error("❌ Error fetching analytics data:", error);
//   }
// };

// // 🕒 Schedule the function to run daily at 00:05 AM
// cron.schedule("42 15 * * *", () => {
//   console.log("🕒 Scheduled task is running at 3:28 PM...");
//   fetchAndStoreAnalyticsData();
// });


// // API Endpoint to Fetch Analytics Data
// exports.getAnalyticsData = async (req, res) => {
//   try {
//     const days = parseInt(req.query.days) || 10;
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);
//     const formattedStartDate = startDate.toISOString().split("T")[0];

//     // Retrieve stored data from MongoDB
//     const storedData = await Visitor.find({
//       date: { $gte: formattedStartDate },
//     }).sort({ date: -1 });

//     res.json({ analyticsData: storedData });
//   } catch (error) {
//     console.error("Error fetching stored analytics data:", error);
//     res.status(500).json({ error: "Failed to fetch stored analytics data" });
//   }
// };




// exports.getPaginatedAnalyticsData = async (req, res) => {
//   try {
//     let { page, limit, startDate, endDate, search } = req.query;

//     // Convert query params
//     page = parseInt(page) || 1; // Default to page 1
//     limit = parseInt(limit) || 10; // Default limit to 10
//     const skip = (page - 1) * limit;

//     // Create MongoDB filter
//     let query = {};

//     // Date range filtering
//     if (startDate && endDate) {
//       query.date = { $gte: startDate, $lte: endDate };
//     }

//     // Search filter (if applicable, searching by activeUsers count)
//     if (search) {
//       query.$or = [
//         { date: { $regex: search, $options: "i" } }, // Search by date
//         { activeUsers: { $regex: search, $options: "i" } } // Search by activeUsers count
//       ];
//     }

//     // Get total number of matching records
//     const totalRecords = await Visitor.countDocuments(query);

//     // Fetch paginated data
//     const analyticsData = await Visitor.find(query)
//       .sort({ date: -1 }) // Sort by date (latest first)
//       .skip(skip)
//       .limit(limit);

//     // Calculate total pages
//     const totalPages = Math.ceil(totalRecords / limit);

//     res.json({
//       totalRecords,
//       currentPage: page,
//       totalPages,
//       analyticsData,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching paginated analytics data:", error);
//     res.status(500).json({ error: "Failed to fetch paginated analytics data" });
//   }
// };
