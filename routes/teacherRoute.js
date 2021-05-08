require("dotenv").config();
const express = require("express");
const teacher = require("../models/teacher");
const student = require("../models/student");
const course = require("../models/course");
const questions = require("../models/quiz")

const router = express.Router();
router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ extended: true }));
//------Defining all routs-----------
router.get('/teacher-login-signup', (req, res) => {
    res.render("teacherLoginSignup")
});
router.get('/teacher-Dashboard', (req, res) => {
    res.render("teacherDashboard")
});
router.get('/logout', (req, res) => {
    res.render("landing")
});
router.get('/create-quiz', (req, res) => {
    res.render("createQuiz")
});
// router.get('/new', (req, res) => {
//     res.send("Req for teacher router")
// })

// router.get('/addNew', (req, res) => {
//     const nayaTeacher = new teacher({
//         teacherID: 1,
//         fname: "Rahul",
//         lname: "ray",
//         email: "avi@gamil.com",
//         courses: [1, 2, 3]
//     });
//     nayaTeacher.save()
//         .then(ans => {
//             console.log(ans)
//             res.send(ans);
//         })
//         .catch(e => {
//             console.log(e)
//             res.send(e);
//         })
// })

// router.get('/showAll', (req, res) => {
//     teacher.find({}).lean()
//         .then(ans => {
//             res.send(ans);
//         })
//         .catch(e => {
//             res.send(e)
//         })
// })

// router.get('/populate', (req, res) => {
//     teacher.find({}).lean()
//         .then(ans => {
//             res.render('takeQuiz', {
//                 fname: ans[1].email,
//                 name: "Rahul",
//                 id: 1231,
//                 course: "3 days backend engineer",
//                 people: ans  
//             })
//         })
//         .catch(e => {
//             res.send(e)
//         })

// })
module.exports = router;
