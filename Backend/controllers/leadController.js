const multer = require("multer");
const XLSX = require("xlsx");
const Lead = require("../models/Leads");

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() }).single("excelFile"); // 'excelFile' should match the frontend input name


function parseExcelDate(excelDate) {
  const excelEpoch = new Date(1899, 11, 30); // Excel's epoch date
  const days = Math.floor(excelDate); // Get the integer part (days since epoch)
  const msPerDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
  return new Date(excelEpoch.getTime() + days * msPerDay); // Calculate the date
}

const createLeadsData = async (req, res) => {
  try {
    let leads = [];

    // Process JSON data from the request body (if any)
    if (req.body && Object.keys(req.body).length > 0) {
      leads = Array.isArray(req.body) ? req.body : [req.body];
    }
    console.log("Leads from request body: ", leads);

    // Process Excel file (if uploaded)
    if (req.file) {
      const fileBuffer = req.file.buffer;

      // Parse Excel file into JSON
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Convert numeric dates in Excel data to readable date format
      sheetData = sheetData.map((row) => {
        if (row.createdOn && !isNaN(row.createdOn)) {
          row.createdOn = parseExcelDate(row.createdOn)
            .toISOString()
            .split("T")[0]; // Convert to 'YYYY-MM-DD'
        }
        return row;
      });

      // Add Excel data to leads array
      leads = leads.concat(sheetData);
    }

    if (leads.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided in request body or file" });
    }

    // Filter out empty rows or rows missing required fields
    const filteredLeads = leads.filter((lead) => {
      if (!lead.phone) return false; // Exclude if phone is missing or falsy
      const phone = String(lead.phone).trim(); // Convert to string and trim whitespace
      return phone.length > 0; // Include only if phone is not empty
    });

    if (filteredLeads.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid leads provided in request body or file" });
    }

    // Collect all phone numbers to check for existing leads
    const phoneNumbers = filteredLeads.map((lead) => String(lead.phone).trim());

    // Check which leads already exist in the database
    const existingLeads = await Lead.find({ phone: { $in: phoneNumbers } });

    // Filter out the leads that already exist
    const newLeads = filteredLeads.filter(
      (lead) =>
        !existingLeads.some(
          (existingLead) => existingLead.phone === String(lead.phone).trim()
        )
    );

    // If no new leads, return early
    if (newLeads.length === 0) {
      return res
        .status(400)
        .json({ message: "No new leads to insert, all leads already exist." });
    }

    // Insert new leads into the database
    const bulkOps = newLeads.map((lead) => {
      return {
        updateOne: {
          filter: { phone: String(lead.phone).trim() },
          update: {
            $setOnInsert: {
              // Insert if it doesn't exist
              name: lead.name || "",
              email: lead.email || "",
              phone: String(lead.phone).trim(),
              city: lead.city || "",
              brand: lead.brand || "",
              source: lead.source || "",
              createdOn: lead.createdOn || "",
            },
          },
          upsert: true, // If no match is found, it will insert
        },
      };
    });

    if (bulkOps.length > 0) {
      const result = await Lead.bulkWrite(bulkOps);
      console.log(`${result.upsertedCount} leads inserted`);
    }

    res.status(200).json({ message: "Leads processed successfully!" });
  } catch (err) {
    console.error("Error saving leads:", err);
    res.status(500).json({ error: "Failed to save leads" });
  }
};

// const getLeadsData = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const search = req.query.search || "";
//     const startDate = req.query.startDate ? req.query.startDate : null; // Leave as string
//     const endDate = req.query.endDate ? req.query.endDate : null; // Leave as string
//     const sortBy = req.query.sortBy || "createdOn";
//     const sortDirection = req.query.sortDirection || "desc";
//     const sortOrder = sortDirection === "asc" ? 1 : -1;

//     // Validate pagination parameters
//     if (page <= 0 || pageSize <= 0) {
//       return res.status(400).json({ error: "Invalid pagination parameters" });
//     }

//     const skip = (page - 1) * pageSize;

//     // Build search filter
//     const searchFilter = search
//       ? {
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { email: { $regex: search, $options: "i" } },
//             { phone: { $regex: search, $options: "i" } },
//             { city: { $regex: search, $options: "i" } },
//             { brand: { $regex: search, $options: "i" } },
//             { source: { $regex: search, $options: "i" } },
//           ],
//         }
//       : {};

//     // Add startDate and endDate to filter if provided
//     if (startDate && endDate) {
//       searchFilter.createdOn = {
//         $gte: startDate, // matching start date string
//         $lte: endDate, // matching end date string
//       };
//     }

//     console.log("Search Filter:", searchFilter);

//     // Fetch leads with pagination, sorting, and date filtering
//     const leads = await Lead.find(searchFilter)
//       .sort({ [sortBy]: sortOrder, _id: -1 })
//       .skip(skip)
//       .limit(pageSize);

//     const totalLeads = await Lead.countDocuments(searchFilter);
//     const totalPages = Math.ceil(totalLeads / pageSize);

//     res.status(200).json({
//       leads,
//       currentPage: page,
//       totalPages,
//       totalLeads,
//     });
//   } catch (error) {
//     console.error("Error occurred while fetching leads:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


const getLeadsData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const preset = req.query.preset || ""; // New: Add preset parameter
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const sortBy = req.query.sortBy || "createdOn";
    const sortDirection = req.query.sortDirection || "desc";
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    // Validate pagination parameters
    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * pageSize;

    // Build search filter
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } },
            { source: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Calculate date range based on preset
    let dateFilter = {};
    const currentDate = new Date();

    switch (preset) {
      case "last-7-days": {
        const last7Days = new Date();
        last7Days.setDate(currentDate.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);
        dateFilter = { $gte: last7Days.toISOString() };
        break;
      }

      case "last-14-days": {
        const last14Days = new Date();
        last14Days.setDate(currentDate.getDate() - 14);
        last14Days.setHours(0, 0, 0, 0);
        dateFilter = { $gte: last14Days.toISOString() };
        break;
      }

      case "last-30-days": {
        const last30Days = new Date();
        last30Days.setDate(currentDate.getDate() - 30);
        last30Days.setHours(0, 0, 0, 0);
        dateFilter = { $gte: last30Days.toISOString() };
        break;
      }

      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        dateFilter = {
          $gte: yesterday.toISOString(),
          $lt: currentDate.toISOString(),
        };
        break;
      }

      case "last-day": {
        const lastDay = new Date();
        lastDay.setDate(currentDate.getDate() - 1);
        lastDay.setHours(0, 0, 0, 0);
        dateFilter = {
          $gte: lastDay.toISOString(),
          $lt: currentDate.toISOString(),
        };
        break;
      }

      case "custom-range": {
        if (startDate && endDate) {
          const customStartDate = new Date(startDate);
          const customEndDate = new Date(endDate);
          customStartDate.setHours(0, 0, 0, 0);
          customEndDate.setHours(23, 59, 59, 999);
          dateFilter = {
            $gte: customStartDate.toISOString(),
            $lte: customEndDate.toISOString(),
          };
        }
        break;
      }

      default:
        // No date filter applied
        break;
    }

    // Add date filter to searchFilter if preset is provided
    if (Object.keys(dateFilter).length > 0) {
      searchFilter.createdOn = dateFilter;
    }

    console.log("Search Filter:", searchFilter);

    // Fetch leads with pagination, sorting, and date filtering
    const leads = await Lead.find(searchFilter)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalLeads = await Lead.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalLeads / pageSize);

    res.status(200).json({
      leads,
      currentPage: page,
      totalPages,
      totalLeads,
    });
  } catch (error) {
    console.error("Error occurred while fetching leads:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  createLeadsData,
  getLeadsData,
  upload,
};
