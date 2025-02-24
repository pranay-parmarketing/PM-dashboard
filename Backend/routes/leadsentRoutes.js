const express = require("express");
const router = express.Router();
const {
    getleadsentData,
  
} = require("../controllers/leadsentController");


router.get("/", getleadsentData);

module.exports = router;
