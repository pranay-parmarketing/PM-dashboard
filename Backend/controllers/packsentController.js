const axios = require("axios");
const cron = require("node-cron");
const { getZohoToken } = require("../config/tokenService");
const Packsent = require("../models/Packsent");
const createPacksent = async () => {
  try {
    const accessToken = await getZohoToken();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];

    console.log(`📡 Fetching data for: ${formattedDate}`);

    const response = await axios.get(
      `https://www.zohoapis.in/crm/v2/zohosign__ZohoSign_Documents/search?criteria=((zohosign__Date_Sent:equals:${formattedDate}))`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const documents = response.data.data;

    if (!documents || documents.length === 0) {
      console.log("⚠️ No documents found.");
      return;
    }

    const leadIds = documents
      .map((doc) => doc.zohosign__Lead?.id)
      .filter(Boolean);
    console.log("📌 All Lead IDs:", leadIds);
    console.log("📌 Unique Lead IDs:", new Set(leadIds).size);
    console.log(
      "📌 Duplicate Lead IDs:",
      leadIds.length - new Set(leadIds).size
    );

    const existingDocs = await Packsent.find({ leadId: { $in: leadIds } });
    const existingLeadIds = new Set(existingDocs.map((doc) => doc.leadId));

    const newDocuments = documents
      .filter((data) => !existingLeadIds.has(data.zohosign__Lead?.id))
      .map((data) => ({
        leadId: data.zohosign__Lead?.id || null,
        leadDate: null,
        name: data.zohosign__Lead?.name || null,
        phone: data.phone || null || null,
        // phone: data.zohosign__Lead?.id || null,
        email: data.Email || null,
        source: data.zohosign__Module_Name || null,
        sentDate: data.zohosign__Date_Sent || null,
        completedDate: data.zohosign__Date_Completed || null,
        status: data.zohosign__Document_Status || null,
        agentname: data.Owner?.name || null,
        di: null, //
      }));

    if (newDocuments.length > 0) {
      try {
        await Packsent.insertMany(newDocuments, { ordered: false });
        console.log(
          `✅ Data saved successfully. New entries: ${newDocuments.length}`
        );
      } catch (error) {
        console.error("⚠️ Some documents were duplicates and were skipped.");
      }
    } else {
      console.log("✅ No new entries found.");
    }
  } catch (error) {
    console.error("❌ Error saving Zoho data to MongoDB:", error.message);
  }
};

cron.schedule("53 8 * * *", async () => {
  console.log("⏳ Running scheduled Zoho API fetch at 12 AM...");
  await createPacksent();
});

const getPacksent = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      sort = "sentDate",
      order = "desc",
      search = "",
      datePreset,
      startDate,
      endDate,
    } = req.query;

    // Parsing and validation
    page = parseInt(page);
    limit = parseInt(limit);
    order = order === "asc" ? 1 : -1;

    console.log("Parsed query parameters:", {
      page,
      limit,
      sort,
      order,
      search,
      datePreset,
      startDate,
      endDate,
    });

    if (datePreset === "custom-range" && (!startDate || !endDate)) {
      console.log("Error: startDate and endDate are required for custom-range");
      return res.status(400).json({
        message: "startDate and endDate are required for custom-range",
      });
    }

    const query = {};
    console.log("Initial query object:", query);

    // Search filter (same as in getDmpData)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
      console.log("Search filter applied:", query);
    }

    // Date filtering based on presets
    if (datePreset) {
      const currentDate = new Date();
      console.log("Current date:", currentDate);

      switch (datePreset) {
        case "last-7-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
          startDate.setUTCHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setUTCHours(23, 59, 59, 999);
          console.log("Date range set for last-7-days:", {
            startDate,
            endDate,
          });
          break;
        case "last-14-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 14);
          startDate.setUTCHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setUTCHours(23, 59, 59, 999);
          console.log("Date range set for last-14-days:", {
            startDate,
            endDate,
          });
          break;
        case "last-30-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 30);
          startDate.setUTCHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setUTCHours(23, 59, 59, 999);
          console.log("Date range set for last-30-days:", {
            startDate,
            endDate,
          });
          break;
        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 1);
          startDate.setUTCHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setUTCHours(23, 59, 59, 999);
          console.log("Date range set for yesterday:", { startDate, endDate });
          break;
        case "custom-range":
          if (startDate && endDate) {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            endDate.setUTCHours(23, 59, 59, 999);
            console.log("Custom date range set:", { startDate, endDate });
          } else {
            console.log(
              "Error: Both startDate and endDate are required for custom-range"
            );
            return res.status(400).json({
              message:
                "Both startDate and endDate are required for custom-range",
            });
          }
          break;
      }
    }

    // Apply custom date range filter if startDate and endDate are provided
    if (startDate && endDate) {
      // Set time to midnight for start date and end date to 23:59:59 for comparison
      startDate.setHours(23, 59, 59, 999);
      endDate.setHours(0, 0, 0, 0);

      // Convert dates to string format "YYYY-MM-DD"
      const startDateStr = startDate.toISOString().split("T")[0]; // "2025-02-12"
      const endDateStr = endDate.toISOString().split("T")[0]; // "2025-02-15"

      // Update the query to match the string format of sentDate
      query.sentDate = {
        $gte: startDateStr,
        $lte: endDateStr,
      };

      console.log("Date filter applied to query:", query);
    }

    // Query for the total number of documents matching the filter
    const totalDocs = await Packsent.countDocuments(query);
    console.log("Total documents matching query:", totalDocs);

    // Query for the actual documents, applying the necessary filters, pagination, and sorting
    const documents = await Packsent.find(query)
      .sort({ [sort]: order })
      .skip((page - 1) * limit)
      .limit(limit);
    console.log("Fetched documents:", documents);

    // 🔥 **Get Yesterday's Lead Sent Count (Fix)** 🔥
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"

    const yesterdayLeadSentCount = await Packsent.countDocuments({
      sentDate: yesterdayStr, // Match as a string
    });

    console.log("Yesterday's lead_sent count:", yesterdayLeadSentCount);

    // Return the response
    res.json({
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
      pageSize: limit,
      data: documents,
      yesterdayLeadSentCount,
    });
  } catch (error) {
    console.error("❌ Error fetching Packsent data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

module.exports = { createPacksent, getPacksent };
