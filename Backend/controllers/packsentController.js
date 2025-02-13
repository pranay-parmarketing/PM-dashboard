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
        phone: data.zohosign__Lead?.id || null,
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


cron.schedule("0 0 * * *", async () => {
  console.log("⏳ Running scheduled Zoho API fetch at 12 AM...");
  await createPacksent();
});

const getPacksent = async (req, res) => {
    try {
      let { page = 1, limit = 10, sort = "sentDate", order = "desc", search = "" } = req.query;
  
      page = parseInt(page);
      limit = parseInt(limit);
      order = order === "asc" ? 1 : -1;
  
      const query = {};
  
     
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }
  
     
      const totalDocs = await Packsent.countDocuments(query);
  
      
      const documents = await Packsent.find(query)
        .sort({ [sort]: order }) 
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json({
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        pageSize: limit,
        data: documents,
      });
    } catch (error) {
      console.error("❌ Error fetching Packsent data:", error.message);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  };
  
  module.exports = { createPacksent, getPacksent };
  
