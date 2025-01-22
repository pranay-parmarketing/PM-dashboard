const express = require("express");
const router = express.Router();
const { createLeadsentData, getLeadsentData, upload } = require('../controllers/sentleadController');

// Route to get Leadsent data
router.get("/", getLeadsentData);

// Route to create Leadsent data (upload file and process data)
router.post("/", upload, createLeadsentData);

module.exports = router;
