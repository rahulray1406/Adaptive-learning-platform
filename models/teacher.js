const mongoose = require("mongoose");
const teacher = mongoose.Schema({
    teacherID: {
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
    profilePicture: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        required: true,
        default: "",
        unique: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
},
    { collection: 'teacher' }
)
mongoose.model('teacher', teacher);
module.exports = mongoose.model("teacher");