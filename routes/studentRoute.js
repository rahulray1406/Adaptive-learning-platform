require("dotenv").config();
const express = require("express");
const teacher = require("../models/teacher");
const student = require("../models/student");
const course = require("../models/course");
const questions = require("../models/quiz");
const reports = require('../models/reports')
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
            student.find({ studentID: req.session.studentID }).lean()
                .then(tea => {
                    console.log("-tea--")
                    console.log(tea);
                    res.render('studentDashboard', {
                        course: data,
                        studentID: req.session.studentID,
                        fname: tea[0].fname,
                        lname: tea[0].lname,
                        email: tea[0].email,
                        teacher: tea[0].teacherID,
                        imgurl: tea[0].profilePicture,
                        points: tea[0].points
                    })
                })

        })
});
router.get('/student/logout', (req, res) => {
    req.session.destroy();
    res.render("landing")
});
router.get('/student/takeQuiz', (req, res) => {
    console.log(req.query);
    let cid = req.query.courseID
    questions.find({ courseID: Number.parseInt(req.query.courseID) }).lean()
        .then(d => {
            console.log("---data----")
            console.log(d);
            var totalMarks = 0;
            d.forEach(v => {
                totalMarks += v.points;
            })
            res.render('takeQuiz', {
                questions: d,
                courseID: cid,
                studentID: req.session.studentID,
                totalMarks: totalMarks
            })
        })
});
router.get('/student/viewReport', (req, res) => {
    reports.findOne({ courseID: Number.parseInt(req.query.courseID) }).lean()
        .then(d => {
            console.log("---report data")
            console.log(d);
            res.render('viewReport', {
                reports: d
            });

        })
        .catch(e => console.log(e));
})
router.get('/student/leaderboard', (req, res) => {

});

module.exports = router;
