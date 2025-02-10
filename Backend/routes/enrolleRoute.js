const express = require("express");
const router = express.Router();
const {
  createEnrolleeData,
  getEnrolleeData,
  upload,
} = require("../controllers/enrolleController");

router.post("/", upload, createEnrolleeData);
router.get("/", getEnrolleeData);

module.exports = router;
