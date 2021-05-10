const mongoose = require("mongoose");
const questions = mongoose.Schema({
    courseID: {
        type: Number,
        required: true,
    },
    questionID: {
        type: Number,
        required: true,
    },
    questionDesc: {
        type: String,
        trim: true,
        required: true
    },
    options: {
        type: Array,
        require: true
    },
    correctOps: {
        type: Array,
        required: true
    },
    points: {
        type: Number,
        require: true,
        default: null
    },

},
    { collection: 'questions' }
)
mongoose.model('questions', questions);
module.exports = mongoose.model("questions");