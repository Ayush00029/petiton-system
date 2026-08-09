const express = require("express");
const router = express.Router();
const { suggestCategory } = require("../controllers/aiController");

router.post("/suggest-category", suggestCategory);

module.exports = router;
