require("dotenv").config();
const express = require("express");
const session = require("express-session");
require("./database");
require("./passportSetup")
const path = require("path")
const passport = require('passport');
var MemoryStore = require('memorystore')(session)
const expHbs = require("express-handlebars");
const helper = require("handlebars-helpers")();
const teacherRoute = require("./routes/teacherRoute");
const studentRoute = require("./routes/studentRoute");
const teacher = require("./models/teacher");
const student = require("./models/student");
const course = require("./models/course");

const router = require("./routes/teacherRoute");
const app = express();



app.use(session({
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
app.use(passport.initialize());
app.use(passport.session())
app.use(teacherRoute);
app.use(studentRoute);
var hbs = expHbs.create({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layout"),
    helpers: helper,
    partialsDir: path.join(__dirname, "views/partials"),
})
app.engine("hbs", hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, "/public")));
app.get('/', (req, res) => {
    res.render("landing");
})

app.get('/teacherLogin', (req, res) => {
    req.session.teacherTryLogin = true;
    console.log(req.session)
    res.redirect('/auth/google')
});

app.get('/studentLogin', (req, res) => {
    req.session.studentTryLogin = true;
    console.log(req.session)
    res.redirect('/auth/google')
});

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    }));

app.get("/auth/google/success", (req, res) => {
    console.log("Success")
    console.log(req.session)
    console.log(req.user)
    let flag = false;
    teacher.findById(req.user)
        .then(d => {
            console.log("teacher found")
            console.log(d);
            // res.send(d);
            if (d) {
                flag = true;
                req.session.studentTryLogin = false;
                return res.redirect('/teacher/teacherRedirect?id=' + d.teacherID)
            }
            else {
                console.log("Teacher not fou, find stuent ry")
                student.findById(req.user)
                    .then(d => {
                        console.log(d);
                        if (!flag) {
                            req.session.studentTryLogin = false;
                            return res.redirect('/student/studentRedirect?id=' + d.studentID)
                        }
                    })
                    .catch(e => console.log(e))
            }

        })
        .catch(e => console.log(e))
})
app.get('testRedirect', (req, res) => {
    res.send("Redirect successfull")
})

app.get("/auth/google/failure", (req, res) => {
    console.log("Failed")
    console.log(req.user)
    console.log(req.session)
    console.log(req.isAuthenticated())
    res.send("login Failed XXXXX")
})

app.post('/ansSubmit', (req, res) => {
    console.log(req.body);
    res.send(true);
})

app.listen(80, (req, res) => console.log("server running at :: http://localhost:80"));