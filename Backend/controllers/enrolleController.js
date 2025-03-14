// const multer = require("multer");
// const XLSX = require("xlsx");
// const Enrollee = require("../models/Enrollee");
// const Leads = require("../models/Leads");

// // Configure multer for file uploads
// const upload = multer({ storage: multer.memoryStorage() }).single("excelFile");

// function parseExcelDate(excelDate) {
//   const excelEpoch = new Date(1899, 11, 30);
//   const days = Math.floor(excelDate);
//   const msPerDay = 24 * 60 * 60 * 1000;
//   return new Date(excelEpoch.getTime() + days * msPerDay);
// }

// const createEnrolleeData = async (req, res) => {
//     try {
//       let enrollees = [];

//       // Process JSON data from the request body
//       if (req.body && Object.keys(req.body).length > 0) {
//         enrollees = Array.isArray(req.body) ? req.body : [req.body];
//       }
//       console.log("Enrollees from request body:", enrollees);

//       // Process Excel file (if uploaded)
//       if (req.file) {
//         const fileBuffer = req.file.buffer;
//         const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//         const sheetName = workbook.SheetNames[0];
//         let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         // Convert numeric dates in Excel data to readable format
//         sheetData = sheetData.map((row) => {
//           if (row.leadDate && !isNaN(row.leadDate)) {
//             row.leadDate = parseExcelDate(row.leadDate)
//               .toISOString()
//               .split("T")[0];
//           }
//           if (row.date && !isNaN(row.date)) {
//             row.date = parseExcelDate(row.date).toISOString().split("T")[0];
//           }
//           return row;
//         });

//         // Add Excel data to enrollees array
//         enrollees = enrollees.concat(sheetData);
//       }

//       if (enrollees.length === 0) {
//         return res
//           .status(400)
//           .json({ error: "No data provided in request body or file" });
//       }

//       // Filter out empty rows or rows missing required fields
//       const filteredEnrollees = enrollees.filter((enrollee) => {
//         if (!enrollee.contactNo) {
//           console.log("Skipping row due to missing contactNo: ", enrollee);
//           return false;
//         }
//         const contactNo = String(enrollee.contactNo).trim();
//         return contactNo.length > 0;
//       });

//       if (filteredEnrollees.length === 0) {
//         return res
//           .status(400)
//           .json({ error: "No valid enrollees provided in request body or file" });
//       }

//       // Collect all contact numbers to check for existing records
//       const contactNumbers = filteredEnrollees.map((enrollee) =>
//         String(enrollee.contactNo).trim()
//       );

//       // Fetch leads where phone matches enrollee's contactNo
//       const leads = await Leads.find({ phone: { $in: contactNumbers } });

//       // Create a map of phone to lead for quick lookup
//       const leadMap = new Map(leads.map(lead => [lead.phone, lead]));

//       // Insert **or update** enrollees in the database
//       const bulkOps = filteredEnrollees.map((enrollee) => {
//         const contactNo = String(enrollee.contactNo).trim();
//         const lead = leadMap.get(contactNo);
//         const leadDate = lead && lead.phone === contactNo ? lead.createdOn : null;

//         return {
//           updateOne: {
//             filter: { contactNo: contactNo },
//             update: {
//               $set: {
//                 leadDate: leadDate,
//                 date: enrollee.date || "",
//                 source: enrollee.source || "",
//                 agent: enrollee.agent || "",
//                 client: enrollee.client || "",
//                 city: enrollee.city || "",
//                 email: enrollee.email || "",
//                 paymentMode: enrollee.paymentMode || "",
//                 paymentMade: enrollee.paymentMade || "",
//                 paymentNumber: enrollee.paymentNumber|| "",
//                 contactNo: contactNo,
//                 disposableIncome: enrollee.disposableIncome || 0,
//                 gst: enrollee.gst || 0,
//                 net: enrollee.net || 0,
//                 status: enrollee.status || "",
//               },
//             },
//             upsert: true, // If exists, update; if not, insert
//           },
//         };
//       });

//       if (bulkOps.length > 0) {
//         const result = await Enrollee.bulkWrite(bulkOps);
//         console.log(`${result.matchedCount} enrollees updated`);
//         console.log(`${result.upsertedCount} new enrollees inserted`);
//       }

//       res.status(200).json({ message: "Enrollees processed successfully!" });
//     } catch (err) {
//       console.error("Error saving enrollees:", err);
//       res.status(500).json({ error: "Failed to save enrollees" });
//     }
//   };

// const getEnrolleeData = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const search = req.query.search || "";
//     const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
//     const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
//     const sortBy = req.query.sortBy || "date";
//     const sortDirection = req.query.sortDirection || "desc";
//     const sortOrder = sortDirection === "asc" ? 1 : -1;

//     if (page <= 0 || pageSize <= 0) {
//       return res.status(400).json({ error: "Invalid pagination parameters" });
//     }

//     const skip = (page - 1) * pageSize;

//     // Build search filter
//     const searchFilter = search
//       ? {
//           $or: [
//             { client: { $regex: search, $options: "i" } },
//             { email: { $regex: search, $options: "i" } },
//             { contactNo: { $regex: search, $options: "i" } },
//             { city: { $regex: search, $options: "i" } },
//             { agent: { $regex: search, $options: "i" } },
//             { source: { $regex: search, $options: "i" } },
//           ],
//         }
//       : {};

//     // Add date range filtering
//     if (startDate && endDate) {
//       // Set time boundaries for accurate filtering
//       startDate.setHours(0, 0, 0, 0);
//       endDate.setHours(23, 59, 59, 999);

//       searchFilter.date = {
//         $gte: startDate,
//         $lte: endDate,
//       };
//     }

//     console.log("Search Filter:", searchFilter);

//     // Fetch enrollees with pagination, sorting, and date filtering
//     const enrollees = await Enrollee.find(searchFilter)
//       .sort({ [sortBy]: sortOrder, _id: -1 })
//       .skip(skip)
//       .limit(pageSize);

//     const totalEnrollees = await Enrollee.countDocuments(searchFilter);
//     const totalPages = Math.ceil(totalEnrollees / pageSize);

//     res.status(200).json({
//       enrollees,
//       currentPage: page,
//       totalPages,
//       totalEnrollees,
//     });
//   } catch (error) {
//     console.error("Error occurred while fetching enrollees:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = {
//   createEnrolleeData,
//   getEnrolleeData,
//   upload,
// };

//
const multer = require("multer");
const XLSX = require("xlsx");
const Enrollee = require("../models/Enrollee");
const Leads = require("../models/Leads");
const axios = require("axios");
const { getZohoToken } = require("../config/tokenService");
const cron = require("node-cron");

const fetchZohoData = async (req = null, res = null) => {
  try {
    const accessToken = await getZohoToken();

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];

    const response = await axios.get(
      `https://www.zohoapis.in/crm/v2/Invoice_Payment/search?criteria=((Payment_Date:equals:${formattedDate})and(Payment_Number:equals:1))`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Access Token:", accessToken);

    if (!response.data || !response.data.data) {
      console.error("Zoho API response is missing data:", response.data);
      if (res)
        return res
          .status(500)
          .json({ error: "Zoho API response is missing data" });
      return;
    }

    const documents = response.data.data;
    console.log("Documents:", documents);

    if (!Array.isArray(documents) || documents.length === 0) {
      if (res)
        return res.status(404).json({ message: "No data found in Zoho API" });
      return;
    }

    for (const doc of documents) {
      const contactNo = doc?.Lead_Name?.id || "N/A"; // Unique identifier for the enrollee

      const lead = await Leads.findOne({ phone: contactNo });
      const leadDate = lead ? lead.createdOn : null; // Use createdOn if lead exists

      const existingEnrollee = await Enrollee.findOne({ contactNo });

      if (!existingEnrollee) {
        // Insert new record
        const newEnrollee = new Enrollee({
          leadDate,
          date: new Date(doc.Payment_Date),
          source: "Zoho API",
          agent: doc?.Owner?.name || "N/A",
          client: doc?.Lead_Name?.name || "N/A",
          city: "N/A", // Update with actual field if available
          email: doc?.Owner?.email || "N/A",
          paymentMode: doc.Payment_Mode || "N/A",
          paymentMade: doc.Payment_Made || 0,
          paymentNumber: doc.Payment_Number || "N/A",
          contactNo, // Unique identifier
          disposableIncome: 0, // Update with actual field if available
          gst: doc.Tax || 0,
          net: doc.Grand_Total || 0,
          status: doc.Status || "N/A",
        });

        await newEnrollee.save();
        console.log(`New enrollee added: ${contactNo}`);
      } else {
        // Update existing record
        await Enrollee.updateOne(
          { contactNo },
          {
            $set: {
              leadDate,
              date: new Date(doc.Payment_Date),
              agent: doc?.Owner?.name || "N/A",
              email: doc?.Owner?.email || "N/A",
              paymentMode: doc.Payment_Mode || "N/A",
              paymentMade: doc.Payment_Made || 0,
              paymentNumber: doc.Payment_Number || "N/A",
              gst: doc.Tax || 0,
              net: doc.Grand_Total || 0,
              status: doc.Status || "N/A",
            },
          }
        );
        console.log(`Enrollee updated: ${contactNo}`);
      }
    }

    console.log("Fetched data successfully and stored in the database.");

    if (res) {
      return res.status(200).json({
        message: "Data fetched successfully and stored in database",
      });
    }
  } catch (error) {
    console.error(
      "Error fetching Zoho data:",
      error?.response?.data || error.message
    );
    if (res)
      return res.status(500).json({
        error: "Failed to fetch Zoho data",
        details: error.message,
      });
  }
};

// **Schedule the cron job to run daily at 11:00 AM**
cron.schedule("0 0 * * *", async () => {
  console.log("Running fetchZohoData automatically...");
  try {
    await fetchZohoData(); // Calling function without req and res
    console.log("Data fetched and stored successfully.");
  } catch (error) {
    console.error("Error running fetchZohoData:", error.message);
  }
});

// cron.schedule("10 2 * * *", async () => {
//   console.log("Running fetchZohoData cron job...");
//   await fetchZohoData();
// });

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() }).single("excelFile");

function parseExcelDate(excelDate) {
  const excelEpoch = new Date(1899, 11, 30);
  const days = Math.floor(excelDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + days * msPerDay);
}

const createEnrolleeData = async (req, res) => {
  try {
    let enrollees = [];

    // Process JSON data from the request body
    if (req.body && Object.keys(req.body).length > 0) {
      enrollees = Array.isArray(req.body) ? req.body : [req.body];
    }
    console.log("Enrollees from request body:", enrollees);

    // Process Excel file (if uploaded)
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Convert numeric dates in Excel data to readable format
      sheetData = sheetData.map((row) => {
        if (row.leadDate && !isNaN(row.leadDate)) {
          row.leadDate = parseExcelDate(row.leadDate)
            .toISOString()
            .split("T")[0];
        }
        if (row.date && !isNaN(row.date)) {
          row.date = parseExcelDate(row.date).toISOString().split("T")[0];
        }
        return row;
      });

      // Add Excel data to enrollees array
      enrollees = enrollees.concat(sheetData);
    }

    if (enrollees.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided in request body or file" });
    }

    // Filter out empty rows or rows missing required fields
    const filteredEnrollees = enrollees.filter((enrollee) => {
      if (!enrollee.contactNo) {
        console.log("Skipping row due to missing contactNo: ", enrollee);
        return false;
      }
      const contactNo = String(enrollee.contactNo).trim();
      return contactNo.length > 0;
    });

    if (filteredEnrollees.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid enrollees provided in request body or file" });
    }

    // Collect all contact numbers to check for existing records
    const contactNumbers = filteredEnrollees.map((enrollee) =>
      String(enrollee.contactNo).trim()
    );

    // Fetch leads where phone matches enrollee's contactNo
    const leads = await Leads.find({ phone: { $in: contactNumbers } });

    // Create a map of phone to lead for quick lookup
    const leadMap = new Map(leads.map((lead) => [lead.phone, lead]));

    // Insert **or update** enrollees in the database
    const bulkOps = filteredEnrollees.map((enrollee) => {
      const contactNo = String(enrollee.contactNo).trim();
      const lead = leadMap.get(contactNo);
      const leadDate = lead && lead.phone === contactNo ? lead.createdOn : null;

      let formattedDate = null;
      if (enrollee.date && typeof enrollee.date === "string") {
        const parts = enrollee.date.split("-");
        if (parts.length === 3) {
          formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // Convert to YYYY-MM-DD
        }
      }

      return {
        updateOne: {
          filter: { contactNo: contactNo },
          update: {
            $set: {
              leadDate: leadDate,
              date: formattedDate || null,
              source: enrollee.source || "",
              agent: enrollee.agent || "",
              client: enrollee.client || "",
              city: enrollee.city || "",
              email: enrollee.email || "",
              paymentMode: enrollee.paymentMode || "",
              paymentMade: enrollee.paymentMade || "",
              paymentNumber: enrollee.paymentNumber || "",
              contactNo: contactNo,
              disposableIncome: enrollee.disposableIncome || 0,
              gst: enrollee.gst || 0,
              net: enrollee.net || 0,
              status: enrollee.status || "",
            },
          },
          upsert: true, // If exists, update; if not, insert
        },
      };
    });

    if (bulkOps.length > 0) {
      const result = await Enrollee.bulkWrite(bulkOps);
      console.log(`${result.matchedCount} enrollees updated`);
      console.log(`${result.upsertedCount} new enrollees inserted`);
    }

    res.status(200).json({ message: "Enrollees processed successfully!" });
  } catch (err) {
    console.error("Error saving enrollees:", err);
    res.status(500).json({ error: "Failed to save enrollees" });
  }
};

const getEnrolleeData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const sortBy = req.query.sortBy || "date";
    const sortDirection = req.query.sortDirection || "desc";
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * pageSize;

    // Build search filter
    const searchFilter = search
      ? {
          $or: [
            { client: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { contactNo: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
            { agent: { $regex: search, $options: "i" } },
            { source: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Add date range filtering
    if (startDate && endDate) {
      // Set time boundaries for accurate filtering
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      searchFilter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    console.log("Search Filter:", searchFilter);

    // Fetch enrollees with pagination, sorting, and date filtering
    const enrollees = await Enrollee.find(searchFilter)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalEnrollees = await Enrollee.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalEnrollees / pageSize);

    // 🔥 **Get Yesterday's Count** 🔥
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setUTCHours(0, 0, 0, 0);

    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setUTCHours(23, 59, 59, 999);

    const yesterdayEnrolleeCount = await Enrollee.countDocuments({
      date: { $gte: yesterdayStart, $lte: yesterdayEnd },
    });

    console.log("Yesterday's enrollee count:", yesterdayEnrolleeCount);

    res.status(200).json({
      enrollees,
      currentPage: page,
      totalPages,
      totalEnrollees,
      yesterdayEnrolleeCount
    });
  } catch (error) {
    console.error("Error occurred while fetching enrollees:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  fetchZohoData,
  createEnrolleeData,
  getEnrolleeData,
  upload,
};
