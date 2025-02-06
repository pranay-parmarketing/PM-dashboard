const multer = require("multer");
const XLSX = require("xlsx");
const Dmp = require("../models/Dmp");
const Leads = require("../models/Leads");

const upload = multer({ storage: multer.memoryStorage() }).single("excelFile");

function parseExcelDate(excelDate) {
  const excelEpoch = new Date(1899, 11, 30);
  const days = Math.floor(excelDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + days * msPerDay);
}

const createDmpData = async (req, res) => {
  try {
    let dmps = [];

    // Step 1: Check if there is data in the request body
    if (req.body && Object.keys(req.body).length > 0) {
      dmps = Array.isArray(req.body) ? req.body : [req.body];
    }
    console.log("DMPs from request body: ", dmps);

    // Step 2: Process uploaded file if present
    if (req.file) {
      const fileBuffer = req.file.buffer;

      // Read and parse the uploaded file
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Parse dates for fields in the schema
      sheetData = sheetData.map((row) => {
        ["call_start_time", "call_end_time"].forEach((key) => {
          if (row[key] && !isNaN(new Date(row[key]))) {
            row[key] = new Date(row[key]);
          }
        });
        return row;
      });

      // Combine the file data with the body data
      dmps = dmps.concat(sheetData);
    }

    // Step 3: If no data found, return error
    if (dmps.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided in request body or file" });
    }

    // Step 4: Extract phone numbers for lookup
    console.log("DMP Data: ", dmps);

    const phoneNumbers = dmps.map((dmp) => String(dmp.phone).trim());

    // Step 5: Check if any DMP already exists in the database
    const existingDmps = await Dmp.find({ phone: { $in: phoneNumbers } });

    // Step 6: Prepare bulk operations for insert/update
    const bulkOps = dmps.map((dmp) => ({
      updateOne: {
        filter: { phone: String(dmp.phone).trim() },
        update: {
          $set: {
            cust_name: dmp.cust_name,
            phone: String(dmp.phone).trim(),
            email: dmp.email,
            agent_id: dmp.agent_id,
            agent_username: dmp.agent_username,
            agent_name: dmp.agent_name,
            campaign_id: dmp.campaign_id,
            campaign_name: dmp.campaign_name,
            process_name: dmp.process_name,
            process_id: dmp.process_id,
            first_disposition: dmp.first_disposition,
            second_disposition: dmp.second_disposition,
            call_start_time: dmp.call_start_time
              ? new Date(dmp.call_start_time)
              : null,
            call_end_time: dmp.call_end_time
              ? new Date(dmp.call_end_time)
              : null,
            record_url: dmp.record_url,
            call_type: dmp.call_type,
            source: dmp.source,
            Created_On: dmp.Created_On,
          },
        },
        upsert: true, // Insert if not found, otherwise update
      },
    }));

    // Step 7: Perform bulk insert/update operation
    if (bulkOps.length > 0) {
      const result = await Dmp.bulkWrite(bulkOps);
      console.log(`${result.upsertedCount} new DMP entries inserted`);
      console.log(`${result.modifiedCount} existing DMP entries updated`);
    }

    // Step 8: Return success message
    res.status(200).json({ message: "DMP data processed successfully!" });
  } catch (err) {
    // Log the error and return failure response
    console.error("Error saving DMP data:", err);
    res.status(500).json({ error: "Failed to save DMP data" });
  }
};

// const getDmpData = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const search = req.query.search || "";
//     let startDate = req.query.startDate || null;
//     let endDate = req.query.endDate || null;
//     const filterPreset = req.query.filterPreset || "";
//     const sortBy = req.query.sortBy || "date";
//     const sortDirection = req.query.sortDirection || "desc";
//     const sortOrder = sortDirection === "asc" ? 1 : -1;

//     if (page <= 0 || pageSize <= 0) {
//       return res.status(400).json({ error: "Invalid pagination parameters" });
//     }

//     const skip = (page - 1) * pageSize;

//     // Handle date filtering based on preset
//     if (filterPreset) {
//       const currentDate = new Date(); // Declare currentDate here
//       switch (filterPreset) {
//         case "last-7-days":
//           startDate = new Date(currentDate);
//           startDate.setDate(currentDate.getDate() - 7);
//           startDate.setUTCHours(0, 0, 0, 0); // Start of the day 7 days ago
//           endDate = new Date(currentDate);
//           endDate.setUTCHours(23, 59, 59, 999); // End of the current day
//           break;

//         case "last-14-days":
//           startDate = new Date(currentDate);
//           startDate.setDate(currentDate.getDate() - 14);
//           startDate.setUTCHours(0, 0, 0, 0); // Start of the day 14 days ago
//           endDate = new Date(currentDate);
//           endDate.setUTCHours(23, 59, 59, 999); // End of the current day
//           break;

//         case "last-30-days":
//           startDate = new Date(currentDate);
//           startDate.setDate(currentDate.getDate() - 30);
//           startDate.setUTCHours(0, 0, 0, 0); // Start of the day 30 days ago
//           endDate = new Date(currentDate);
//           endDate.setUTCHours(23, 59, 59, 999); // End of the current day
//           break;

//         case "yesterday":
//           startDate = new Date(currentDate);
//           startDate.setDate(currentDate.getDate() - 1);
//           startDate.setUTCHours(0, 0, 0, 0); // Start of yesterday (UTC)
//           endDate = new Date(startDate);
//           endDate.setUTCHours(23, 59, 59, 999); // End of yesterday (UTC)
//           break;

//         case "custom-range":
//           if (startDate && endDate) {
//             startDate = new Date(startDate); // Ensure it's a Date object
//             endDate = new Date(endDate); // Ensure it's a Date object
//             endDate.setUTCHours(23, 59, 59, 999); // End of the day in UTC
//           } else {
//             return res.status(400).json({
//               error: "Both startDate and endDate are required for custom-range",
//             });
//           }
//           break;

//         default:
//           break;
//       }
//     }

//     // Convert startDate and endDate to Date objects if they are provided
//     if (startDate && isNaN(new Date(startDate).getTime())) {
//       return res.status(400).json({ error: "Invalid startDate" });
//     }
//     if (endDate && isNaN(new Date(endDate).getTime())) {
//       return res.status(400).json({ error: "Invalid endDate" });
//     }

//     if (startDate) startDate = new Date(startDate);
//     if (endDate) {
//       endDate = new Date(endDate);
//       endDate.setUTCHours(23, 59, 59, 999); // End of the day in UTC
//     }

//     // Build search filter
//     const searchFields = [
//       "phone",
//       "source",
//       "agent_username",
//       "cust_name",
//       "first_disposition",
//     ];
//     const searchFilter = search
//       ? {
//           $or: searchFields.map((field) => ({
//             [field]: { $regex: search, $options: "i" },
//           })),
//         }
//       : {};

//     // Add date and time filter if both startDate and endDate are provided
//     if (startDate && endDate) {
//       searchFilter.call_start_time = {
//         $gte: startDate, // Greater than or equal to the start date and time
//         $lte: endDate, // Less than or equal to the end date and time
//       };
//     }

//     // Query the database
//     const dmps = await Dmp.find(searchFilter)
//       .sort({ [sortBy]: sortOrder, _id: -1 })
//       .skip(skip)
//       .limit(pageSize);

//     // Log the result count
//     const totalDmps = await Dmp.countDocuments(searchFilter);
//     const totalPages = Math.ceil(totalDmps / pageSize);

//     // Calculate yesterday's count
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);

//     const startOfYesterday = new Date(yesterday);
//     startOfYesterday.setUTCHours(0, 0, 0, 0); // Start of yesterday (UTC)

//     const endOfYesterday = new Date(startOfYesterday);
//     endOfYesterday.setUTCHours(23, 59, 59, 999); // End of yesterday (UTC)

//     const yesterdayFilter = {
//       call_start_time: {
//         $gte: startOfYesterday,
//         $lte: endOfYesterday,
//       },
//     };

//     const yesterdayCount = await Dmp.countDocuments(yesterdayFilter);

//     res.status(200).json({
//       dmps,
//       currentPage: page,
//       totalPages,
//       totalDmps,
//       yesterdayCount,
//     });
//   } catch (error) {
//     console.error("Error occurred while fetching DMP data:", error);
//     return res
//       .status(500)
//       .json({ error: "Internal Server Error", details: error.message });
//   }
// };

const getDmpData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    let startDate = req.query.startDate || null;
    let endDate = req.query.endDate || null;
    const filterPreset = req.query.filterPreset || "";
    const sortBy = req.query.sortBy || "date";
    const sortDirection = req.query.sortDirection || "desc";
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * pageSize;

    // Date filtering logic...
    if (filterPreset) {
      const currentDate = new Date();
      switch (filterPreset) {
        case "last-7-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
          startDate.setUTCHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setUTCHours(23, 59, 59, 999);
          break;
        case "last-14-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 14);
          startDate.setUTCHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setUTCHours(23, 59, 59, 999);
          break;
        case "last-30-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 30);
          startDate.setUTCHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
          endDate.setUTCHours(23, 59, 59, 999);
          break;
        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 1);
          startDate.setUTCHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setUTCHours(23, 59, 59, 999);
          break;
        case "custom-range":
          if (startDate && endDate) {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            endDate.setUTCHours(23, 59, 59, 999);
          } else {
            return res.status(400).json({
              error: "Both startDate and endDate are required for custom-range",
            });
          }
          break;
      }
    }

    if (startDate && isNaN(new Date(startDate).getTime())) {
      return res.status(400).json({ error: "Invalid startDate" });
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({ error: "Invalid endDate" });
    }

    if (startDate) startDate = new Date(startDate);
    if (endDate) {
      endDate = new Date(endDate);
      endDate.setUTCHours(23, 59, 59, 999);
    }

    // Search filter
    const searchFields = [
      "phone",
      "source",
      "agent_username",
      "cust_name",
      "first_disposition",
    ];
    const searchFilter = search
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        }
      : {};

    if (startDate && endDate) {
      searchFilter.call_start_time = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Query DMP data
    let dmps = await Dmp.find(searchFilter)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(pageSize);

    // Fetch Leads and match with DMPs
    const leadPhones = dmps.map((dmp) => dmp.phone);
    const leads = await Leads.find({ phone: { $in: leadPhones } });

    // Add lead_date if a matching lead exists
    dmps = dmps.map((dmp) => {
      const lead = leads.find((lead) => lead.phone === dmp.phone);
      return {
        ...dmp._doc, // Spread existing DMP data
        lead_date: lead ? lead.createdOn : null, // Add lead_date from Lead model
      };
    });

    // Get total count of documents
    const totalDmps = await Dmp.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDmps / pageSize);

    // Calculate yesterday's count
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setUTCHours(0, 0, 0, 0);
    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setUTCHours(23, 59, 59, 999);

    const yesterdayFilter = {
      call_start_time: {
        $gte: startOfYesterday,
        $lte: endOfYesterday,
      },
    };

    const yesterdayCount = await Dmp.countDocuments(yesterdayFilter);

    res.status(200).json({
      dmps,
      currentPage: page,
      totalPages,
      totalDmps,
      yesterdayCount,
    });
  } catch (error) {
    console.error("Error occurred while fetching DMP data:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};



module.exports = {
  createDmpData,
  getDmpData,
  upload,
};
