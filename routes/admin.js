const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {getSubjects, createSubject, getOneSub, getOneModule, createModule, createQuestion} = require("../controllers/admin");

router.get("/", catchAsync(getSubjects));

router.post("/", catchAsync(createSubject));

router.get("/subjects/:subId", catchAsync(getOneSub));

router.get("/subjects/:subId/modules/:modId", catchAsync(getOneModule));

router.post("/subjects/:subId/modules", catchAsync(createModule));

router.post("/subjects/:subId/modules/:modId/questions", catchAsync(createQuestion));

module.exports = router;
