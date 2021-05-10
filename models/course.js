const mongoose = require("mongoose");
const course = mongoose.Schema({
    courseID: {
        type: Number,
        required: true,
        unique: true,
    },
    teacherID: {
        type: Number,
        required: true,
    },
    courseName: {
        type: String,
        trim: true,
        required: true
    },
    quizActive: {
        type: Boolean,
        default:false
    },
    createdOn: {
        type: Date,
        //required:true,
        default: Date.now
    },
    expireOn: {
        type: Date,
        //required:true,
        default: Date.now
    },
},
    { collection: 'course' }
)
mongoose.model('course', course);
module.exports = mongoose.model("course");