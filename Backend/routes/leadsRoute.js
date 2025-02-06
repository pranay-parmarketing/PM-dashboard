
const express = require('express');
const router = express.Router();
const { createLeadsData, getLeadsData, upload } = require('../controllers/leadController');

// Route to upload leads (either via JSON or Excel file)
router.post('/', upload, createLeadsData); // This will handle the file upload and data insertion

// Route to get all leads from the database
router.get('/', getLeadsData); // Fetch all leads

module.exports = router;
