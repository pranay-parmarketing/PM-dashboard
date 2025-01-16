// const express = require('express');
// const router = express.Router();
// const leadController = require('../controllers/leadController');

// // Route to fetch all leads
// router.get('/', leadController.getLeads);

// // Route to create a single lead via API
// router.post('/', leadController.createLead);

// // Route for bulk uploading leads from an Excel file
// router.post('/bulk-upload', leadController.bulkUploadLeads);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { createLeadsData, getLeadsData, upload } = require('../controllers/leadController');

// Route to upload leads (either via JSON or Excel file)
router.post('/', upload, createLeadsData); // This will handle the file upload and data insertion

// Route to get all leads from the database
router.get('/', getLeadsData); // Fetch all leads

module.exports = router;
