const student = require("./models/student")
const teacher = require("./models/teacher")
const passport = require('passport');
const googleStrategy = require('passport-google-oauth2');
const { request } = require("express");

passport.serializeUser(function (user, done) {
    console.log("Serialize user")
    console.log(user)
    return done(null, user._id);
});

passport.deserializeUser(function (userId, done) {
    console.log("Deserilize uid: ")
    console.log(userId)
    done(null, userId);
    // return done(null, userId);
});

passport.use(new googleStrategy({
    clientID: "958559105804-01b7hs7eegahnoo84si2sfu4hmr95901.apps.googleusercontent.com",
    clientSecret: "8QT0OSyOdhkjIJueZ2j4t9fT",
    callbackURL: process.env.AUTH_URL,
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        console.log(profile.given_name);
        console.log(profile.family_name)
        console.log(profile.email)
        console.log(profile.picture)
        console.log("Session data")
        console.log(request.session)
        if (request.session.teacherTryLogin) {
            teacher.findOne({ email: profile.email })
                .then(data => {
                    if (data) {
                        return done(null, data);
                    }
                    else {
                        let newreq;
                        teacher.aggregate([{ $group: { _id: null, maxid: { $max: "$teacherID" } } }])
                            .then(d => {
                                console.log(d[0])
                                newreq = d[0].maxid + 1;
                                const nayTeacher = new teacher({
                                    teacherID: newreq,
                                    fname: profile.given_name,
                                    lname: profile.family_name,
                                    profilePicture: profile.picture,
                                    email: profile.email
                                })
                                nayTeacher.save()
                                    .then(ans => {
                                        teacher.findOne({ email: profile.email })
                                            .then(data => {
                                                console.log(data)
                                                return done(null, data);
                                            })
                                    })
                            })

                    }
                })
                .catch(err => console.log(err));
        }
        else {
            console.log("Student login inti")
            console.log(request.session.studentTryLogin)
            student.findOne({ email: profile.email })
                .then(data => {
                    if (data) {
                        console.log("Student login inti: STUDENT FOUND")
                        return done(null, data);
                    }
                    else {
                        let newreq;
                        student.aggregate([{ $group: { _id: null, maxid: { $max: "$studentID" } } }])
                            .then(d => {
                                console.log(d[0])
                                newreq = d[0].maxid + 1;
                                const naystudent = new student({
                                    studentID: newreq,
                                    fname: profile.given_name,
                                    lname: profile.family_name,
                                    profilePicture: profile.picture,
                                    email: profile.email,
                                    points: 1,
                                    expPoints: 1,
                                    teacherID: 9999
                                })
                                naystudent.save()
                                    .then(ans => {
                                        console.log("Student login inti:STUDNT SAVED")
                                        student.findOne({ email: profile.email })
                                            .then(data => {
                                                console.log(data)
                                                return done(null, data);
                                            })
                                    })
                                    .catch(e => {
                                        console.log(e);
                                    })
                            })

                    }
                })
                .catch(err => console.log(err));
        }

    }
));