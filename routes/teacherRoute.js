require("dotenv").config();
const express = require("express");
const teacher = require("../models/teacher");
const student = require("../models/student");
const course = require("../models/course");
const questions = require("../models/quiz")
const session = require("express-session");
var MemoryStore = require('memorystore')(session)

const router = express.Router();
router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ extended: true }));
router.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: "1234asdf",
    resave: false,
    saveUninitialized: false,
    maxAge: 3600000
}
))
//------Defining all routs-----------
router.get('/teacherRedirect', (req, res) => {
    console.log("Teacher entery redirect")
    console.log(req.query)
    req.session.teacherID = Number.parseInt( req.query.id);
    console.log(req.session)
    res.redirect('Dashboard');
    // teacher.find({ teacherID: req.session.teacherID }).lean()
    //     .then(data => {
    //         console.log(data);
    //         res.render('Dashboard', {
    //             teacher: data
    //         })
    //     })
    //     .catch(e => console.log(e))
})
router.get('/Dashboard', (req, res) => {
    // const courseName=req.query.courseName;
    // const courseID=req.query.courseID;
    // console.log(courseName);
    // console.log(courseID);
    console.log(req.session)
    course.find({ teacherID: req.session.teacherID }).lean()
        .then(data => {
            console.log(data);
            res.render('teacherDashboard', {
                courses: data
            })
        })
        .catch(err => console.log(err));
});
router.post('/addCourse', (req, res) => {
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
                    res.redirect("Dashboard")
                })
                .catch(err => console.log(err));
        })

    // const courseName=req.body.courseName;
    // const courseID=req.body.courseID;
    // console.log(courseName);
    // console.log(courseID);
    // res.render("teacherDashboard")
});

router.get('/logout', (req, res) => {
    res.render("landing")
});
router.get('/createQuiz', (req, res) => {
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

router.post('/addQuestion', (req, res) => {
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
            res.redirect("createQuiz?id=" + req.body.courseid)
        })

});
router.get('/deleteCourse', (req, res) => {
    let cid = req.query.id;
    course.deleteOne({ courseID: Number.parseInt(cid) })
        .then(ans => {
            console.log(ans)
            res.redirect('Dashboard')
        })
})
router.get('/deleteQuestion', (req, res) => {
    console.log("req body----------------")

    console.log(req.query)
    // let questionid = req.query.id;
    // let cid=req.query.cid
    questions.deleteOne({ questionID: Number.parseInt(req.query.id) })
        .then(ans => {
            console.log(ans)
            res.redirect('createQuiz?id=' + req.query.cid)
        })
})
router.post('/publishQuiz', (req, res) => {
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
            res.redirect('createQuiz?id=' + req.body.cid)
        })
        .catch(er => console.log(er))
})

router.post('/courseUpdate', (req, res) => {
    console.log("course update called-----------------------")
    console.log(req.body)
    course.updateOne({ courseID: Number.parseInt(req.body.cid) }, {
        courseName: req.body.cname,
    })
        .then(data => {
            // console.log("--data----------")
            // console.log(data)
            res.redirect('Dashboard')
        })
        .catch(er => console.log(er))
})
router.post('/editQuestions', (req, res) => {
    console.log("course update called-----------------------")
    console.log(req.query)
    questions.updateOne({ questionID: Number.parseInt(req.body.questionid) }, {
        questionDesc: req.body.questionDesc,
        points: req.body.maxMarks,
        // options:req.body.correctOps,
        correctOps: req.body.correctOps,
    })
        .then(data => {
            res.redirect('createQuiz?id=' + req.body.cid)
        })
        .catch(er => console.log(er))
})
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
