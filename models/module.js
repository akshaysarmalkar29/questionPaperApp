const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleModel = new Schema({
    title: String,
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    marks: Number,
    numOfQuestions: Number
});

module.exports = mongoose.model("Module", moduleModel);