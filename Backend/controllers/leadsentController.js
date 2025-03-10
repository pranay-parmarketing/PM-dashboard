const multer = require("multer");
const XLSX = require("xlsx");
const Dmp = require("../models/Dmp");
const Leads = require("../models/Leads");

// const getleadsentData = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const search = req.query.search || "";
//     let startDate = req.query.startDate || null;
//     let endDate = req.query.endDate || null;
//     const filterPreset = req.query.filterPreset || "";
//     const sortBy = req.query.sortBy || "createdAt";
//     const sortDirection = req.query.sortDirection || "desc";
//     const sortOrder = sortDirection === "asc" ? 1 : -1;

//     if (page <= 0 || pageSize <= 0) {
//       return res.status(400).json({ error: "Invalid pagination parameters" });
//     }

//     const skip = (page - 1) * pageSize;

//     // Date Filtering
//     if (filterPreset) {
//       const currentDate = new Date();
//       switch (filterPreset) {
//         case "last-7-days":
//           startDate = new Date(currentDate);
//           startDate.setDate(currentDate.getDate() - 7);
//           break;
//         case "last-14-days":
//           startDate = new Date(currentDate);
//           startDate.setDate(currentDate.getDate() - 14);
//           break;
//         case "last-30-days":
//           startDate = new Date(currentDate);
//           startDate.setDate(currentDate.getDate() - 30);
//           break;
//         case "yesterday":
//           startDate = new Date(currentDate);
//           startDate.setDate(currentDate.getDate() - 1);
//           endDate = new Date(startDate);
//           break;
//         case "custom-range":
//           if (!startDate || !endDate) {
//             return res.status(400).json({ error: "Both startDate and endDate are required for custom-range" });
//           }
//           break;
//       }
//     }

//     if (startDate) startDate = new Date(startDate);
//     if (endDate) {
//       endDate = new Date(endDate);
//       endDate.setUTCHours(23, 59, 59, 999);
//     }

//     // Search Filter - Ensure It Only Affects "Transfer Call" Data
//     const searchFilter = {
//       first_disposition: "Transfer Call",
//       ...(search
//         ? {
//             $or: [
//               { phone: { $regex: search, $options: "i" } },
//               { source: { $regex: search, $options: "i" } },
//               { agent_username: { $regex: search, $options: "i" } },
//               { cust_name: { $regex: search, $options: "i" } },
//             ],
//           }
//         : {}),
//     };

//     if (startDate && endDate) {
//       searchFilter.createdAt = { $gte: startDate, $lte: endDate };
//     }

//     // 🔥 Count Total Only Based on Filtered Data
//     const totalDmps = await Dmp.countDocuments(searchFilter);
//     const totalPages = Math.ceil(totalDmps / pageSize);

//     // 🔥 Fetch Only Filtered Data
//     let dmps = await Dmp.find(searchFilter)
//       .sort({ [sortBy]: sortOrder, _id: -1 })
//       .skip(skip)
//       .limit(pageSize);

//     // Fetch Matching Leads
//     const leadPhones = dmps.map((dmp) => dmp.phone);
//     const leads = await Leads.find({ phone: { $in: leadPhones } });

//     // Merge Lead Data
//     dmps = dmps.map((dmp) => {
//       const lead = leads.find((lead) => lead.phone === dmp.phone);
//       return {
//         ...dmp._doc,
//         lead_date: lead ? lead.createdOn : null,
//       };
//     });

//     // 🔥 Get Yesterday's Count for "Transfer Call" Only
//     const yesterdayStart = new Date();
//     yesterdayStart.setDate(yesterdayStart.getDate() - 1);
//     yesterdayStart.setUTCHours(0, 0, 0, 0);

//     const yesterdayEnd = new Date(yesterdayStart);
//     yesterdayEnd.setUTCHours(23, 59, 59, 999);

//     const yesterdayCount = await Dmp.countDocuments({
//       first_disposition: "Transfer Call",
//       createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
//     });

//     res.status(200).json({
//       dmps,
//       currentPage: page,
//       totalPages,
//       totalDmps,
//       yesterdayCount,
//     });
//   } catch (error) {
//     console.error("Error occurred while fetching DMP data:", error);
//     return res.status(500).json({
//       error: "Internal Server Error",
//       details: error.message,
//     });
//   }
// };

const getleadsentData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    let startDate = req.query.startDate || null;
    let endDate = req.query.endDate || null;
    const filterPreset = req.query.filterPreset || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortDirection = req.query.sortDirection || "desc";
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    // Validate pagination parameters
    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * pageSize;

    // Date Filtering
    if (filterPreset) {
      const currentDate = new Date();
      switch (filterPreset) {
        case "last-7-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
          endDate = new Date(currentDate);
          break;
        case "last-14-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 14);
          endDate = new Date(currentDate);
          break;
        case "last-30-days":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 30);
          endDate = new Date(currentDate);
          break;
        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 1);
          endDate = new Date(startDate);
          break;
        case "custom-range":
          if (!startDate || !endDate) {
            return res.status(400).json({ error: "Both startDate and endDate are required for custom-range" });
          }
          break;
        default:
          break;
      }
    }

    // Convert startDate and endDate to Date objects
    if (startDate) startDate = new Date(startDate);
    if (endDate) {
      endDate = new Date(endDate);
      endDate.setUTCHours(23, 59, 59, 999);
    }

    // Search Filter - Ensure It Only Affects "Transfer Call" Data
    const searchFilter = {
      first_disposition: "Transfer Call",
      ...(search
        ? {
            $or: [
              { phone: { $regex: search, $options: "i" } },
              { source: { $regex: search, $options: "i" } },
              { agent_username: { $regex: search, $options: "i" } },
              { cust_name: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    };

    // Add date filter to searchFilter if startDate and endDate are provided
    if (startDate && endDate) {
      searchFilter.createdAt = { $gte: startDate, $lte: endDate };
    }

    // 🔥 Count Total Only Based on Filtered Data
    const totalDmps = await Dmp.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDmps / pageSize);

    // 🔥 Fetch Only Filtered Data
    let dmps = await Dmp.find(searchFilter)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(pageSize);

    // Fetch Matching Leads
    const leadPhones = dmps.map((dmp) => dmp.phone);
    const leads = await Leads.find({ phone: { $in: leadPhones } });

    // Merge Lead Data
    dmps = dmps.map((dmp) => {
      const lead = leads.find((lead) => lead.phone === dmp.phone);
      return {
        ...dmp._doc,
        lead_date: lead ? lead.createdOn : null,
      };
    });

    // 🔥 Get Yesterday's Count for "Transfer Call" Only
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setUTCHours(0, 0, 0, 0);

    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setUTCHours(23, 59, 59, 999);

    const yesterdayCount = await Dmp.countDocuments({
      first_disposition: "Transfer Call",
      createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
    });

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

module.exports = { getleadsentData };
