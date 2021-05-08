require("dotenv").config();
const express = require("express");
const session = require("express-session");
require("./database");
const path = require("path")
const passport = require('passport');
var MemoryStore = require('memorystore')(session)
const expHbs = require("express-handlebars");
const helper = require("handlebars-helpers")();
const teacherRoute = require("./routes/teacherRoute");
const studentRoute = require("./routes/studentRoute");
const app = express();

app.use('/teacher', teacherRoute);
app.use('/student', studentRoute);

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
var hbs = expHbs.create({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layout"),
    helpers: helper,
    partialsDir: path.join(__dirname, "views/partials"),
})
app.engine("hbs", hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, "./public")));
app.get('/', (req, res) => {
    res.render("landing");
})

app.listen(80, (req, res) => console.log("server running at :: http://localhost"));