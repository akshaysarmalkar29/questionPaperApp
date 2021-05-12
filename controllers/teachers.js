const Subject = require("../models/subject");
const Pattern = require("../models/pattern");

module.exports = {
    async getDashboard(req, res, next) {
        const subjects = await Subject.find({});
        res.render("dashboard", {subjects})
    },
    async getPatterns(req, res, next) {
        const semPatterns = await Pattern.find({maxMarks: 80});
        const unitPatterns = await Pattern.find({maxMarks: 20});
        console.log(semPatterns);
        res.render("patterns", {semPatterns, unitPatterns});
    }
}