const mongoose = require("mongoose");
const reports = mongoose.Schema({
    courseID: {
        type: Number,
        required: true,
    },
    studentID: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        require: true,
    },
    totalAttempt: {
        type: Number,
        require: true,
    },
    marksAchived: {
        type: Number,
        require: true,
    },
    startTime: {
        type: Date,
        //required:true,
        default: Date.now
    },
    endTime: {
        type: Date,
        //required:true,
        default: Date.now
    },
},
    { collection: 'reports' }
)
mongoose.model('reports', reports);
module.exports = mongoose.model("reports");