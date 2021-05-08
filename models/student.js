const mongoose = require("mongoose");
const student = mongoose.Schema({
    studentID: {
        type: Number,
        required: true,
        unique: true,
    },
    fname: {
        type: String,
        trim: true,
        required: true
    },
    lname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        default: ""
    },

    points: {
        type: Number,
        require: true,
        default: null
    },
    expPoints: {
        type: Number,
        require: true,
        default: null
    },
    createdOn: {
        type: Date,
        //required:true,
        default: Date.now
    },
    teacherID:{
        type:Number,
        required:true,
        unique:true,
    },
},
    { collection: 'student' }
)
mongoose.model('student', student);
module.exports = mongoose.model("student");