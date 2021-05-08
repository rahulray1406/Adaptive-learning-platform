const mongoose=require("mongoose");
const teacher=mongoose.Schema({
    teacherID:{
        type:Number,
        required:true,
        unique:true,
    },
    fname:{
        type:String,
        trim:true,
        required:true
    },
    lname:{
        type:String,
        trim:true,
        required:true
    },
    email:{
      type:String,
      trim:true,
    required:true,
      default:""
    },
    createdOn:{
        type:Date,
        default:Date.now
    },
    courses:{
        type:Array,
        require:true,
    },
},
{collection : 'teacher'}
)
mongoose.model('teacher',teacher);
module.exports=mongoose.model("teacher");