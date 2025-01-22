const multer = require("multer");
const XLSX = require("xlsx");
const Leadsent = require("../models/Leadsent"); // Updated from Dmp to Leadsent

const upload = multer({ storage: multer.memoryStorage() }).single("excelFile");

function parseExcelDate(excelDate) {
  const excelEpoch = new Date(1899, 11, 30);
  const days = Math.floor(excelDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + days * msPerDay);
}

const createLeadsentData = async (req, res) => {
  try {
    let leads = [];

    if (req.body && Object.keys(req.body).length > 0) {
      leads = Array.isArray(req.body) ? req.body : [req.body];
    }

    if (req.file) {
      const fileBuffer = req.file.buffer;
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      sheetData = sheetData.map((row) => {
        if (row.date && !isNaN(row.date)) {
          row.date = parseExcelDate(row.date).toISOString().split("T")[0];
        }
        if (row.follow_up_date && !isNaN(row.follow_up_date)) {
          row.follow_up_date = parseExcelDate(row.follow_up_date)
            .toISOString()
            .split("T")[0];
        }
        return row;
      });

      leads = leads.concat(sheetData);
    }

    if (leads.length === 0) {
      return res
        .status(400)
        .json({ error: "No data provided in request body or file" });
    }

    const filteredLeads = leads.filter((lead) => {
      const phone = lead.phone ? String(lead.phone).trim() : null;
      return phone; // Ensure phone exists for validation
    });

    if (filteredLeads.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid Leadsent data provided in request body or file" });
    }

    const phoneNumbers = filteredLeads.map((lead) => String(lead.phone).trim());

    const existingLeads = await Leadsent.find({ phone: { $in: phoneNumbers } });

    const newLeads = filteredLeads.filter(
      (lead) =>
        !existingLeads.some(
          (existingLead) => existingLead.phone === String(lead.phone).trim()
        )
    );

    if (newLeads.length === 0) {
      return res.status(400).json({
        message: "No new Leadsent data to insert, all entries already exist.",
      });
    }

    const bulkOps = newLeads.map((lead) => ({
      updateOne: {
        filter: { phone: String(lead.phone).trim() },
        update: {
          $setOnInsert: {
            id: lead.id,
            date: lead.date,
            phone: String(lead.phone).trim(),
            lead_id: lead.lead_id,
            team: lead.team,
            transfer_to: lead.transfer_to,
            lvt_agent: lead.lvt_agent,
            follow_up_date: lead.follow_up_date,
            source_raw: lead.source_raw,
            update: lead.update,
            created_at: lead.created_at,
            updated_at: lead.updated_at,
            deleted_at: lead.deleted_at,
          },
        },
        upsert: true, // Insert if not found
      },
    }));

    if (bulkOps.length > 0) {
      const result = await Leadsent.bulkWrite(bulkOps);
      console.log(`${result.upsertedCount} Leadsent entries inserted`);
    }

    res.status(200).json({ message: "Leadsent data processed successfully!" });
  } catch (err) {
    console.error("Error saving Leadsent data:", err);
    res.status(500).json({ error: "Failed to save Leadsent data" });
  }
};

const getLeadsentData = async (req, res) => {
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
            { lead_id: { $regex: search, $options: "i" } },
            { lvt_agent: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    if (startDate && endDate) {
      searchFilter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const leads = await Leadsent.find(searchFilter)
      .sort({ [sortBy]: sortOrder, _id: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalLeads = await Leadsent.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalLeads / pageSize);

    res.status(200).json({
      leads,
      currentPage: page,
      totalPages,
      totalLeads,
    });
  } catch (error) {
    console.error("Error occurred while fetching Leadsent data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createLeadsentData,
  getLeadsentData,
  upload,
};
