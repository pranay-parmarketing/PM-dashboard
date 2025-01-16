// const Lead = require('../models/Leads');
// const multer = require('multer');
// const XLSX = require('xlsx');
// const path = require('path');

// // Configure multer for file uploads
// const upload = multer({
//   storage: multer.memoryStorage(), // Store the file in memory for processing
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       // Accept only Excel files
//       cb(null, true);
//     } else {
//       cb(new Error('Only .xlsx files are allowed'), false);
//     }
//   }
// }).single('excelFile'); // Field name 'excelFile' must match what is sent from frontend

// // Fetch all leads
// exports.getLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find();
//     res.status(200).json({
//       message: 'Leads fetched successfully',
//       data: leads,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'An error occurred while fetching leads',
//       error: error.message,
//     });
//   }
// };

// // Create a new lead via API
// exports.createLead = async (req, res) => {
//   try {
//     const { name, email, phone, city, source } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !city || !source) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const newLead = new Lead({
//       name,
//       email,
//       phone,
//       city,
//       source,
//     });

//     const savedLead = await newLead.save();

//     res.status(201).json({
//       message: 'Lead created successfully',
//       data: savedLead,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: 'Email or phone already exists',
//         error: error.keyValue,
//       });
//     }
//     res.status(500).json({
//       message: 'An error occurred while creating the lead',
//       error: error.message,
//     });
//   }
// };

// // Bulk upload leads from Excel file
// // Bulk upload leads from Excel file
// exports.bulkUploadLeads = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: 'File upload failed', error: err.message });
//     }

//     try {
//       // Parse the Excel file from memory
//       const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];

//       // Convert sheet to JSON
//       const data = XLSX.utils.sheet_to_json(sheet);

//       console.log("Parsed Excel Data: ", data);  // Log the parsed data for debugging

//       // Map data to the Lead model
//       const leads = data.map((row) => ({
//         name: row.Name,
//         email: row.Email,
//         phone: row.Phone,
//         city: row.City,
//         source: row.Source,
//         createdOn: row.CreatedOn ? new Date(row.CreatedOn) : new Date(),
//       }));

//       console.log("Mapped Leads: ", leads);  // Log the mapped leads to see if data is correct

//       // Insert leads into the database
//       const insertedLeads = await Lead.insertMany(leads);

//       res.status(201).json({
//         message: 'Leads uploaded successfully',
//         data: insertedLeads,
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: 'Error processing the Excel file',
//         error: error.message,
//       });
//     }
//   });
// };

const multer = require("multer");
const XLSX = require("xlsx");
const Lead = require("../models/Leads");

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() }).single("excelFile"); // 'excelFile' should match the frontend input name

// const createLeadsData = async (req, res) => {
//   try {
//     let leads = [];

//     // Process JSON data from the request body (if any)
//     if (req.body && Object.keys(req.body).length > 0) {
//       leads = Array.isArray(req.body) ? req.body : [req.body];
//     }
//     console.log("Leads from request body: ", leads);

//     // Process Excel file (if uploaded)
//     if (req.file) {
//       const fileBuffer = req.file.buffer;

//       // Parse Excel file into JSON
//       const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//       const sheetName = workbook.SheetNames[0]; // Get the first sheet
//       const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//       // Add Excel data to leads array
//       leads = leads.concat(sheetData);
//     }

//     if (leads.length === 0) {
//       return res.status(400).json({ error: "No data provided in request body or file" });
//     }

//     // Filter out empty rows or rows missing required fields
//     const filteredLeads = leads.filter((lead) => {
//       if (!lead.phone) return false; // Exclude if phone is missing or falsy
//       const phone = String(lead.phone).trim(); // Convert to string and trim whitespace
//       return phone.length > 0; // Include only if phone is not empty
//     });

//     if (filteredLeads.length === 0) {
//       return res.status(400).json({ error: "No valid leads provided in request body or file" });
//     }

//     // Insert leads into the database (no validation checks, just skipping existing entries)
//     for (const lead of filteredLeads) {
//       // Check if lead already exists in the database by phone
//       const existingLead = await Lead.findOne({ phone: lead.phone });

//       if (existingLead) {
//         console.log(`Lead with phone ${lead.phone} already exists, skipping.`);
//         continue; // Skip this lead if it already exists
//       }

//       // Insert the lead only if it does not already exist
//       await Lead.create({
//         name: lead.name || "", // Default empty string if the field is missing
//         email: lead.email || "", // Default empty string if the field is missing
//         phone: String(lead.phone).trim(), // Ensure phone is a trimmed string
//         city: lead.city || "", // Default empty string if the field is missing
//         brand: lead.brand || "", // Default empty string if the field is missing
//         source: lead.source || "", // Default empty string if the field is missing
//         createdOn: lead.createdOn ? new Date(lead.createdOn) : new Date(), // Set current date if createdOn is missing
//       });
//     }

//     res.status(200).json({ message: "Leads saved successfully!" });
//   } catch (err) {
//     console.error("Error saving leads:", err);
//     res.status(500).json({ error: "Failed to save leads" });
//   }
// };

// const createLeadsData = async (req, res) => {
//   try {
//     let leads = [];

//     // Process JSON data from the request body (if any)
//     if (req.body && Object.keys(req.body).length > 0) {
//       leads = Array.isArray(req.body) ? req.body : [req.body];
//     }
//     console.log("Leads from request body: ", leads);

//     // Process Excel file (if uploaded)
//     if (req.file) {
//       const fileBuffer = req.file.buffer;

//       // Parse Excel file into JSON
//       const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//       const sheetName = workbook.SheetNames[0]; // Get the first sheet
//       const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//       // Add Excel data to leads array
//       leads = leads.concat(sheetData);
//     }

//     if (leads.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "No data provided in request body or file" });
//     }

//     // Filter out empty rows or rows missing required fields
//     const filteredLeads = leads.filter((lead) => {
//       if (!lead.phone) return false; // Exclude if phone is missing or falsy
//       const phone = String(lead.phone).trim(); // Convert to string and trim whitespace
//       return phone.length > 0; // Include only if phone is not empty
//     });

//     if (filteredLeads.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "No valid leads provided in request body or file" });
//     }

//     // Collect all phone numbers to check for existing leads
//     const phoneNumbers = filteredLeads.map((lead) => String(lead.phone).trim());

//     // Check which leads already exist in the database
//     const existingLeads = await Lead.find({ phone: { $in: phoneNumbers } });

//     // Filter out the leads that already exist
//     const newLeads = filteredLeads.filter(
//       (lead) =>
//         !existingLeads.some(
//           (existingLead) => existingLead.phone === String(lead.phone).trim()
//         )
//     );

//     // If no new leads, return early
//     if (newLeads.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No new leads to insert, all leads already exist." });
//     }

//     // Insert new leads into the database
//     const bulkOps = newLeads.map((lead) => {
//       return {
//         updateOne: {
//           filter: { phone: String(lead.phone).trim() },
//           update: {
//             $setOnInsert: {
//               // Insert if it doesn't exist
//               name: lead.name || "",
//               email: lead.email || "",
//               phone: String(lead.phone).trim(),
//               city: lead.city || "",
//               brand: lead.brand || "",
//               source: lead.source || "",
//               createdOn: lead.createdOn || "",
//             },
//           },
//           upsert: true, // If no match is found, it will insert
//         },
//       };
//     });

//     if (bulkOps.length > 0) {
//       const result = await Lead.bulkWrite(bulkOps);
//       console.log(`${result.upsertedCount} leads inserted`);
//     }

//     res.status(200).json({ message: "Leads processed successfully!" });
//   } catch (err) {
//     console.error("Error saving leads:", err);
//     res.status(500).json({ error: "Failed to save leads" });
//   }
// };

// Helper function to parse Excel numeric dates
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

// Fetch all leads
// const getLeadsData = async (req, res) => {
//   try {
//     // Get the page number and page size from query params
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 leads per page

//     // Calculate the number of documents to skip
//     const skip = (page - 1) * pageSize;

//     // Fetch the leads with pagination
//     const leads = await Lead.find()
//       .skip(skip)
//       .limit(pageSize)

//     console.log("Fetched leads from DB:", leads);

//     // Count the total number of leads
//     const totalLeads = await Lead.countDocuments();

//     if (!leads || leads.length === 0) {
//       return res.status(404).json({ message: "No leads found" });
//     }

//     // Return paginated results with metadata (current page, total pages)
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

// const getLeadsData = async (req, res) => {
//   try {
//     // Get the page number and page size from query params
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 leads per page
//     const search = req.query.search || ""; // Get the search query (default empty string)

//     // Calculate the number of documents to skip
//     const skip = (page - 1) * pageSize;

//     // Build the search filter
//     const searchFilter = search
//       ? {
//           $or: [
//             { name: { $regex: search, $options: "i" } }, // Case-insensitive match
//             { email: { $regex: search, $options: "i" } },
//             { phone: { $regex: search, $options: "i" } },
//             { city: { $regex: search, $options: "i" } },
//             { brand: { $regex: search, $options: "i" } },
//           ],
//         }
//       : {}; // If no search query, return all leads

//     // Fetch the leads with pagination and search filter
//     const leads = await Lead.find(searchFilter)
//       .skip(skip)
//       .limit(pageSize);

//     console.log("Fetched leads from DB:", leads);

//     // Count the total number of leads matching the search filter
//     const totalLeads = await Lead.countDocuments(searchFilter);

//     if (!leads || leads.length === 0) {
//       return res.status(404).json({ message: "No leads found" });
//     }

//     // Return paginated results with metadata (current page, total pages)
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



// const getLeadsData = async (req, res) => {
//   try {
//     // Get the page number and page size from query params
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 leads per page
//     const search = req.query.search || " "; // Get the search query (default empty string)
//     const sortOrder = req.query.sortOrder || "desc";

//     // Calculate the number of documents to skip
//     const skip = (page - 1) * pageSize;

//     // Build the search filter
//     const searchFilter = search
//       ? {
//           $or: [
//             { name: { $regex: search, $options: "i" } }, // Case-insensitive match
//             { email: { $regex: search, $options: "i" } },
//             { phone: { $regex: search, $options: "i" } },
//             { city: { $regex: search, $options: "i" } },
//             { brand: { $regex: search, $options: "i" } },
//             { source: { $regex: search, $options: "i" } },
//           ],
//         }
//       : {}; // If no search query, return all leads

//     // Fetch the leads with pagination and search filter
//     const leads = await Lead.find(searchFilter)
//       // .sort({ createdOn: sortOrder === "desc" ? -1 : 1 })
//       .sort({ createdOn: -1, _id: -1 })
//       .skip(skip)
//       .limit(pageSize);

//     console.log("Fetched leads from DB:", leads);

//     // Count the total number of leads matching the search filter
//     const totalLeads = await Lead.countDocuments(searchFilter);

//     // Return paginated results with metadata (current page, total pages)
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


// const getLeadsData = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const search = req.query.search || "";
//     const sortBy = req.query.sortBy || "createdOn";
//     const sortDirection = req.query.sortDirection || "desc";
//     const sortOrder = sortDirection === 'asc' ? 1 : -1;

//     // Validate pagination parameters
//     if (page <= 0 || pageSize <= 0) {
//       return res.status(400).json({ error: "Invalid pagination parameters" });
//     }

//     const skip = (page - 1) * pageSize;

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

//     // Fetch leads with pagination and sorting
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
    const startDate = req.query.startDate ? req.query.startDate : null;  // Leave as string
    const endDate = req.query.endDate ? req.query.endDate : null;  // Leave as string
    const sortBy = req.query.sortBy || "createdOn";
    const sortDirection = req.query.sortDirection || "desc";
    const sortOrder = sortDirection === 'asc' ? 1 : -1;

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

    // Add startDate and endDate to filter if provided
    if (startDate && endDate) {
      searchFilter.createdOn = {
        $gte: startDate, // matching start date string
        $lte: endDate,   // matching end date string
      };
    }

    console.log('Search Filter:', searchFilter);

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
