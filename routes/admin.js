const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {getSubjects, createSubject, getOneSub, getOneModule, createModule, createQuestion, updateQuestion, deleteQuestion, updateSubject, updateModule} = require("../controllers/admin");

router.get("/", catchAsync(getSubjects));

router.post("/", catchAsync(createSubject));

router.get("/subjects/:subId", catchAsync(getOneSub));

router.put("/subjects/:subId", catchAsync(updateSubject));

router.get("/subjects/:subId/modules/:modId", catchAsync(getOneModule));

router.put("/subjects/:subId/modules/:modId", catchAsync(updateModule));

router.post("/subjects/:subId/modules", catchAsync(createModule));

router.post("/subjects/:subId/modules/:modId/questions", catchAsync(createQuestion));

router.put("/subjects/:subId/modules/:modId/questions/:questionId", catchAsync(updateQuestion));

router.delete("/subjects/:subId/modules/:modId/questions/:questionId", catchAsync(deleteQuestion));

module.exports = router;
