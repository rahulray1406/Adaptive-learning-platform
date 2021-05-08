require("dotenv").config();
const express = require("express");
const teacher = require("../models/teacher");
const student = require("../models/student");
const course = require("../models/course");
const questions = require("../models/quiz")

const router = express.Router();
router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ extended: true }));
//-----Defining all routs-------------
router.get('/student-login-signup', (req, res) => {
    res.render("studentLoginSignup")
});
router.post('/student-Dashboard', (req, res) => {
    res.render("studentDashboard")
});
router.get('/logout', (req, res) => {
    res.render("landing")
});
router.get('/take-quiz', (req, res) => {
    res.render("takeQuiz")
});
router.get('/leaderboard',(req,res)=>{
    res.render("studentLeaderboard")
});
module.exports = router;
