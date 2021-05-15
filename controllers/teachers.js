const Subject = require("../models/subject");
const Pattern = require("../models/pattern");
const Module = require("../models/module");
const Set = require("../models/set");
const Question = require("../models/question");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");

module.exports = {
    async getDashboard(req, res, next) {
        const subjects = await Subject.find({});
        res.render("dashboard", {subjects})
    },
    async getPatterns(req, res, next) {
        const {subjectId} = req.params;
        const subject = await Subject.findById(subjectId);
        const semPatterns = await Pattern.find({maxMarks: 80});
        const unitPatterns = await Pattern.find({maxMarks: 20});
        res.render("patterns", {semPatterns, unitPatterns, subject});
    },
    async getSpecificPattern(req, res, next) {
        const {subjectId, patternId} = req.params;
        const subject = await Subject.findById(subjectId).populate('modules');
        res.render("specificPattern", {subject, patternId});
    },
    async generatePaper(req, res, next) {
        const {subjectId, patternId, customise} = req.params;
        const subject = await Subject.findById(subjectId);
        if(customise === "no") {
            const {portion} = req.body;
            const pattern = await Pattern.findById(patternId).populate('sets').exec();
            const modules = await Module.find({_id: {
                $in: portion
            }}).populate({
                path: 'questions',
                populate: {
                    path: 'module',
                    model: 'Module'
                }
            }).exec();
            const refArr = [];
            const questions = [];
            for(let i = 0; i < modules.length; i++) {
                refArr.push(i);
            }
            const {sets} = pattern;
            for(let j = 0; j < sets.length; j++) {
                const set = sets[j];
                console.log(set);
                let sliceArr = refArr.slice();
                let markDeduct = Math.floor(set.marks / set.questionsToAttempt);
                for(let k = 0; k < set.totalQuestions; k++) {
                    const randNum = Math.floor(Math.random() * sliceArr.length);
                    const curModule = modules[sliceArr[randNum]];
                    if(curModule.marks >= markDeduct) {
                        let randIdx = Math.floor(Math.random() * curModule.questions.length);
                        let newQuestion = curModule.questions[randIdx];
                        curModule.questions.splice(randIdx, 1);
                        curModule.marks-=markDeduct;
                        sliceArr.splice(randNum, 1);
                        questions.push({title: newQuestion.title, module: newQuestion.module.title});
                    } else {
                        k--;
                        sliceArr.splice(randNum, 1);
                    }
                    if(!sliceArr.length) {
                        sliceArr = refArr.slice();
                    }
                }
                sliceArr = refArr.slice();
            }
            console.log(questions);
            res.render("paper", {questions});
            ejs.renderFile(path.join(__dirname, './views/', "paper.ejs"), {
                questions: questions
            }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "header": {
                            "height": "20mm",
                        },
                        "footer": {
                            "height": "20mm",
                        },
        
                    };
                    pdf.create(data, options).toFile("questionPaper.pdf", function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            let pathToAttachment = `${__dirname}/questionPaper.pdf`;
                            let attachment = fs.readFileSync(pathToAttachment).toString("base64");
                            const msg = {
                            to: 'akshaysarmalkar29@gmail.com',
                            from: 'akshaysarmalkar74@gmail.com',
                            subject: `${subject.title} Question Paper`,
                            text: 'Please Check Attachment',
                            attachments: [
                                {
                                content: attachment,
                                filename: "attachment.pdf",
                                type: "application/pdf",
                                disposition: "attachment"
                                }
                            ]
                            };
                            sgMail.send(msg).catch(err => {
                            console.log(err);
                            });
                        }
                    });
                }
            });
        } else {
            const {portion} = req.body;
            const pattern = await Pattern.findById(patternId).populate('sets').exec();
            const modules = await Module.find({_id: {
                $in: portion
            }}).populate({
                path: 'questions',
                populate: {
                    path: 'module',
                    model: 'Module'
                }
            }).exec();

            console.log(req.body);
            const {marks} = req.body;
            for(let key in marks) {
                if(marks[key]) {
                    for(let module of modules) {
                        if(module.title === key) {
                            module.numOfQuestions = marks[key];
                            break;
                        }
                    }
                }
            }

            const refArr = [];
            const questions = [];
            for(let i = 0; i < modules.length; i++) {
                refArr.push(i);
            }
            const {sets} = pattern;
            for(let j = 0; j < sets.length; j++) {
                const set = sets[j];
                console.log(set);
                let sliceArr = refArr.slice();
                for(let k = 0; k < set.totalQuestions; k++) {
                    const randNum = Math.floor(Math.random() * sliceArr.length);
                    const curModule = modules[sliceArr[randNum]];
                    if(curModule.numOfQuestions > 0) {
                        let randIdx = Math.floor(Math.random() * curModule.questions.length);
                        let newQuestion = curModule.questions[randIdx];
                        curModule.questions.splice(randIdx, 1);
                        sliceArr.splice(randNum, 1);
                        questions.push({title: newQuestion.title, module: newQuestion.module.title});
                        curModule.numOfQuestions--;
                    } else {
                        k--;
                        sliceArr.splice(randNum, 1);
                    }
                    if(!sliceArr.length) {
                        sliceArr = refArr.slice();
                    }
                }
                sliceArr = refArr.slice();
            }
            console.log(questions);
            res.render("paper", {questions});
            ejs.renderFile(path.join(__dirname, './views/', "paper.ejs"), {
                questions: questions
            }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "header": {
                            "height": "20mm",
                        },
                        "footer": {
                            "height": "20mm",
                        },
        
                    };
                    pdf.create(data, options).toFile("questionPaper.pdf", function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            let pathToAttachment = `${__dirname}/questionPaper.pdf`;
                            let attachment = fs.readFileSync(pathToAttachment).toString("base64");
                            const msg = {
                            to: 'akshaysarmalkar29@gmail.com',
                            from: 'akshaysarmalkar74@gmail.com',
                            subject: `${subject.title} Question Paper`,
                            text: 'Please Check Attachment',
                            attachments: [
                                {
                                content: attachment,
                                filename: "attachment.pdf",
                                type: "application/pdf",
                                disposition: "attachment"
                                }
                            ]
                            };
                            sgMail.send(msg).catch(err => {
                            console.log(err);
                            });
                        }
                    });
                }
            });
        }
    }
}