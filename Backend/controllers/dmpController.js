const multer = require("multer");
const XLSX = require("xlsx");
const Dmp = require("../models/Dmp");

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

    if (req.body && Object.keys(req.body).length > 0) {
      dmps = Array.isArray(req.body) ? req.body : [req.body];
    }
    console.log("DMPs from request body: ", dmps);

    if (req.file) {
      const fileBuffer = req.file.buffer;

      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; 
      let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      sheetData = sheetData.map((row) => {
        if (row.date && !isNaN(row.date)) {
          row.date = parseExcelDate(row.date).toISOString().split("T")[0]; 
        }
        if (row.lead_date && !isNaN(row.lead_date)) {
          row.lead_date = parseExcelDate(row.lead_date)
            .toISOString()
            .split("T")[0];
        }
        return row;
      });

     
      dmps = dmps.concat(sheetData);
    }

    if (dmps.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided in request body or file" });
    }

   
    const filteredDmps = dmps.filter((dmp) => {
      const phone = dmp.phone ? String(dmp.phone).trim() : null;
      const leadDate = dmp.lead_date ? new Date(dmp.lead_date) : null;
      const date = dmp.date ? new Date(dmp.date) : null;
      const source = dmp.source ? dmp.source.trim() : null;
      const agent = dmp.agent ? dmp.agent.trim() : null;

      return (
        phone &&
        leadDate &&
        date &&
        source &&
        agent &&
        !isNaN(leadDate.getTime()) &&
        !isNaN(date.getTime())
      );
    });

    if (filteredDmps.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid DMP data provided in request body or file" });
    }

    const phoneNumbers = filteredDmps.map((dmp) => String(dmp.phone).trim());

    const existingDmps = await Dmp.find({ phone: { $in: phoneNumbers } });

    const newDmps = filteredDmps.filter(
      (dmp) =>
        !existingDmps.some(
          (existingDmp) => existingDmp.phone === String(dmp.phone).trim()
        )
    );

    if (newDmps.length === 0) {
      return res.status(400).json({
        message: "No new DMP data to insert, all entries already exist.",
      });
    }

    const bulkOps = newDmps.map((dmp) => ({
      updateOne: {
        filter: { phone: String(dmp.phone).trim() },
        update: {
          $setOnInsert: {
            lead_date: dmp.lead_date,
            date: dmp.date,
            phone: String(dmp.phone).trim(),
            source: dmp.source,
            agent: dmp.agent,
          },
        },
        upsert: true, 
      },
    }));

    if (bulkOps.length > 0) {
      const result = await Dmp.bulkWrite(bulkOps);
      console.log(`${result.upsertedCount} DMP entries inserted`);
    }

    res.status(200).json({ message: "DMP data processed successfully!" });
  } catch (err) {
    console.error("Error saving DMP data:", err);
    res.status(500).json({ error: "Failed to save DMP data" });
  }
};

const getDmpData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const startDate = req.query.startDate ? req.query.startDate : null;
    const endDate = req.query.endDate ? req.query.endDate : null;
    const sortBy = req.query.sortBy || "date";
    const sortDirection = req.query.sortDirection || "desc";
    const sortOrder = sortDirection === "asc" ? 1 : -1;

   
    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * pageSize;

   
    const searchFilter = search
      ? {
          $or: [
            { phone: { $regex: search, $options: "i" } },
            { source: { $regex: search, $options: "i" } },
            { agent: { $regex: search, $options: "i" } },
          ],
        }
      : {};

  
    if (startDate && endDate) {
      searchFilter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    console.log("Search Filter:", searchFilter);

    const dmps = await Dmp.find(searchFilter)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalDmps = await Dmp.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDmps / pageSize);

    res.status(200).json({
      dmps,
      currentPage: page,
      totalPages,
      totalDmps,
    });
  } catch (error) {
    console.error("Error occurred while fetching DMP data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createDmpData,
  getDmpData,
  upload,
};
