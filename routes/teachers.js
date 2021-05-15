const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {getDashboard, getPatterns, getSpecificPattern, generatePaper} = require("../controllers/teachers");

router.get("/", catchAsync(getDashboard));

router.get("/:subjectId/patterns", catchAsync(getPatterns));

router.get("/:subjectId/patterns/:patternId", catchAsync(getSpecificPattern));

router.post("/:subjectId/patterns/:patternId/generate", catchAsync(generatePaper));

module.exports = router;