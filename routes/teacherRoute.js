require("dotenv").config();
const express = require("express");
const teacher = require("../models/teacher");
const student = require("../models/student");
const course = require("../models/course");
const questions = require("../models/quiz")
// const session = require("express-session");
// var MemoryStore = require('memorystore')(session)

const router = express.Router();
router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ extended: true }));

//------Defining all routs-----------
router.get('/teacher/teacherRedirect', (req, res) => {
    console.log("Teacher entery redirect")
    console.log(req.query)
    req.session.teacherID = Number.parseInt(req.query.id);
    console.log(req.session)
    res.redirect('/teacher/Dashboard');
    // teacher.find({ teacherID: req.session.teacherID }).lean()
    //     .then(data => {
    //         console.log(data);
    //         res.render('Dashboard', {
    //             teacher: data
    //         })
    //     })
    //     .catch(e => console.log(e))
})
router.get('/teacher/Dashboard', (req, res) => {
    // const courseName=req.query.courseName;
    // const courseID=req.query.courseID;
    // console.log(courseName);
    // console.log(courseID);
    console.log(req.session)
    course.find({ teacherID: req.session.teacherID }).lean()
        .then(data => {
            teacher.find({ teacherID: req.session.teacherID }).lean()
                .then(tea => {
                    console.log("-tea--")
                    console.log(tea);
                    res.render('teacherDashboard', {
                        courses: data,
                        teacherID: req.session.teacherID,
                        fname: tea[0].fname,
                        lname: tea[0].lname,
                        email: tea[0].email,
                        imgurl: tea[0].profilePicture,
                    })
                })
        })
        .catch(err => console.log(err));
});
router.post('/teacher/addCourse', (req, res) => {
    let newreq;
    console.log(req.session)

    course.aggregate([{ $group: { _id: null, maxid: { $max: "$courseID" } } }])
        .then((d) => {
            console.log(d[0])
            newreq = d[0].maxid + 1;
            const newCourse = new course({
                courseID: newreq,
                teacherID: req.session.teacherID,
                courseName: req.body.courseName
            });
            newCourse.save()
                .then(data => {
                    console.log(data);
                    res.redirect("/teacher/Dashboard")
                })
                .catch(err => console.log(err));
        })

});

router.get('/teacher/logout', (req, res) => {
    req.session.destroy();
    res.render("landing")
});
router.get('/teacher/createQuiz', (req, res) => {
    console.log(req.query)
    questions.find({ courseID: Number.parseInt(req.query.id) }).lean()
        .then(d => {
            console.log(d);
            res.render("createQuiz", {
                courseID: req.query.id,
                questions: d
            })
        })
});

router.post('/teacher/addQuestion', (req, res) => {
    console.log(req.body)
    let newreq;
    questions.aggregate([{ $group: { _id: null, maxid: { $max: "$questionID" } } }])
        .then(d => {
            console.log(d[0])
            newreq = d[0].maxid + 1;
            const newQuestion = new questions({
                courseID: req.body.courseid,
                questionID: newreq,
                questionDesc: req.body.questionDesc,
                options: req.body.options,
                points: req.body.maxMarks,
                correctOps: req.body.correctOps
            });
            newQuestion.save()
                .then(data => {
                    console.log(data);
                })
                .catch(err => console.log(err));
            res.redirect("/teacher/createQuiz?id=" + req.body.courseid)
        })

});
router.get('/teacher/deleteCourse', (req, res) => {
    let cid = req.query.id;
    course.deleteOne({ courseID: Number.parseInt(cid) })
        .then(ans => {
            console.log(ans)
            res.redirect('/teacher/Dashboard')
        })
})
router.get('/teacher/deleteQuestion', (req, res) => {
    console.log("req body----------------")

    console.log(req.query)
    // let questionid = req.query.id;
    // let cid=req.query.cid
    questions.deleteOne({ questionID: Number.parseInt(req.query.id) })
        .then(ans => {
            console.log(ans)
            res.redirect('/teacher/createQuiz?id=' + req.query.cid)
        })
})
router.post('/teacher/publishQuiz', (req, res) => {
    console.log("course update called-----------------------")
    console.log(req.body)
    course.updateOne({ courseID: Number.parseInt(req.body.cid) }, {
        // courseName: req.body.cname,
        createdOn: req.body.startTime,
        expireOn: req.body.endTime,
        quizActive: true
    })
        .then(data => {
            // console.log("--data----------")
            // console.log(data)
            res.redirect('/teacher/createQuiz?id=' + req.body.cid)
        })
        .catch(er => console.log(er))
})

router.post('/teacher/courseUpdate', (req, res) => {
    console.log("course update called-----------------------")
    console.log(req.body)
    course.updateOne({ courseID: Number.parseInt(req.body.cid) }, {
        courseName: req.body.cname,
    })
        .then(data => {
            // console.log("--data----------")
            // console.log(data)
            res.redirect('/teacher/Dashboard')
        })
        .catch(er => console.log(er))
})
router.post('/teacher/editQuestions', (req, res) => {
    console.log("course update called-----------------------")
    console.log(req.query)
    questions.updateOne({ questionID: Number.parseInt(req.body.questionid) }, {
        questionDesc: req.body.questionDesc,
        points: req.body.maxMarks,
        // options:req.body.correctOps,
        correctOps: req.body.correctOps,
    })
        .then(data => {
            res.redirect('/teacher/createQuiz?id=' + req.body.cid)
        })
        .catch(er => console.log(er))
})

module.exports = router;
