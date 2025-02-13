// const express = require("express");
// const router = express.Router();
// const {createPacksent,getPacksent} = require('../controllers/packsentController')

// router.post('/',createPacksent)
// router.get('/',getPacksent)

// module.exports = router;


const express = require("express");
const { createPacksent,getPacksent } = require('../controllers/packsentController')

const router = express.Router();

router.get("/fetch", createPacksent); // Fetch & store API data
router.get("/", getPacksent); // Get stored data

module.exports = router;
