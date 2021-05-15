const Question = require("../models/question");
const Subject = require("../models/subject");
const Module = require("../models/module");

module.exports = {
    async getSubjects(req, res, next) {
        const subjects = await Subject.find({});
        res.render("admin/subjects", {subjects});
    },
    async createSubject(req, res, next) {
        const newSub = new Subject(req.body.subject);
        await newSub.save();
        res.redirect("/admin");
    },
    async getOneSub(req, res, next) {
        const {subId} = req.params;
        const subject = await Subject.findById(subId).populate("modules");
        res.render("admin/specificSub", {subject});
    },
    async updateSubject(req, res, next) {
        const {subId} = req.params;
        await Subject.findByIdAndUpdate(subId, req.body.subject);
        res.redirect("/admin")
    },
    async getOneModule(req, res, next) {
        const {modId, subId} = req.params;
        const subject = await Subject.findById(subId);
        const module = await Module.findById(modId).populate("questions");
        res.render("admin/specificMod", {module, subject});
    },
    async createModule(req, res, next) {
        const {subId} = req.params;
        const sub = await Subject.findById(subId);
        const newModule = new Module(req.body.module);
        newModule.subject = sub._id;
        newModule.numOfQuestions = 0;
        sub.modules.push(newModule);
        await newModule.save();
        await sub.save();
        res.redirect(`/admin/subjects/${sub._id}`);
    },
    async updateModule(req, res, next) {
        const {modId, subId} = req.params;
        await Module.findByIdAndUpdate(modId, req.body.module);
        res.redirect(`/admin/subjects/${subId}`);
    },
    async createQuestion(req, res, next) {
        const {modId, subId} = req.params;
        const module = await Module.findById(modId);
        const newQuestion = new Question(req.body.question);
        newQuestion.module = module._id;
        module.questions.push(newQuestion);
        await newQuestion.save();
        await module.save();
        res.redirect(`/admin/subjects/${subId}/modules/${modId}`);
    },
    async updateQuestion(req, res, next) {
        const {questionId, subId, modId} = req.params;
        await Question.findByIdAndUpdate(questionId, req.body.question);
        res.redirect(`/admin/subjects/${subId}/modules/${modId}`);
    },
    async deleteQuestion(req, res, next) {
        const {questionId, subId, modId} = req.params;
        await Question.findByIdAndDelete(questionId);
        res.redirect(`/admin/subjects/${subId}/modules/${modId}`);
    }

 }