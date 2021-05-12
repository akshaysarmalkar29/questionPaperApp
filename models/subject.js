const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectModel = new Schema({
    title: String,
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }],
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    maxMarks: Number,
    totalMarks: Number
});

module.exports = mongoose.model("Subject", subjectModel);