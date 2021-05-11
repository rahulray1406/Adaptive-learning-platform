require("dotenv").config();
const express = require("express");
const teacher = require("../models/teacher");
const student = require("../models/student");
const course = require("../models/course");
const questions = require("../models/quiz");
// const session = require("express-session");
// var MemoryStore = require('memorystore')(session)

const router = express.Router();
router.use(express.json({ limit: "50mb" }));
// router.use(session({
//     cookie: { maxAge: 86400000 },
//     store: new MemoryStore({
//         checkPeriod: 86400000 // prune expired entries every 24h
//     }),
//     secret: "1234asdf",
//     resave: false,
//     saveUninitialized: false,
//     maxAge: 3600000
// }
// ))
//-----Defining all routs-------------
router.get('/student/studentRedirect', (req, res) => {
    req.session.studentID = Number.parseInt(req.query.id);
    student.find({ studentID: req.session.studentID }).lean()
        .then(data => {
            console.log(data);
            if (data[0].teacherID == 9999) {
                return res.render('updateTeacher', {
                    studentID: req.session.studentID
                })
            }
            req.session.teacherID = data[0].teacherID;
            res.redirect('/student/Dashboard');
        })
        .catch(e => console.log(e))
})

router.post('/student/updateTeacherID', (req, res) => {
    req.session.teacherID = req.body.teacherID
    console.log(req.body)
    student.updateOne({ studentID: req.body.studentID }, {
        teacherID: req.body.teacherID
    })
        .then(d => {
            res.redirect('/student/Dashboard')
        })
})
router.get('/student/Dashboard', (req, res) => {
    course.find({ teacherID: req.session.teacherID }).lean()
        .then(data => {
            console.log(data);
            res.render('studentDashboard', {
                course: data,
                studentID: req.session.studentID
            })

        })
});
router.get('/student/logout', (req, res) => {
    res.render("landing")
});
router.get('/student/takeQuiz', (req, res) => {
    console.log(req.query);
    let cid = req.query.courseID
    questions.find({ courseID: Number.parseInt(req.query.courseID) }).lean()
        .then(d => {
            console.log("---data----")
            console.log(d);
            res.render('takeQuiz', {
                questions: d
            })
        })
});
router.post('/student/ansSubmit', (req, res) => {

})
router.get('/student/leaderboard', (req, res) => {
    res.render("studentLeaderboard")
});

module.exports = router;
