const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {getDashboard, getPatterns} = require("../controllers/teachers");

router.get("/", catchAsync(getDashboard));

router.get("/:subjectId/patterns", catchAsync(getPatterns));

module.exports = router;