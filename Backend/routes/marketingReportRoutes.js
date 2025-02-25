const express = require("express");
const { getMarketingReport } = require("../controllers/marketingReportController");

const router = express.Router();

router.get("/", getMarketingReport);

module.exports = router;
