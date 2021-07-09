const express = require('express')
const path = require('path')
var session = require('express-session')
const bodyParser = require('body-parser')
const urlencodedparser = bodyParser.urlencoded({ extended: true })
const queries = require('./db_queries')
const forgotpwd = require('./forget_pwd')
const router = new express.Router()
const { check, validationResult } = require('express-validator')
/*queries.insertUser({
    user_id: "vishnu.vk632",
    password: "vishnuvk23",
    mail_id: "vishnu.vk632@gmail.com",
    first_name: "Vishnu",
    last_name: "kumar S",
    age: 18,
    gender: "Male",
    phone_no: "9876543210",
    college: "Amrita Vishwa Vidhyapeetham",
    state: "Tamil Nadu",
    room_id:"Vatsan"
})
queries.insertAdmin({
    user_id: "Vatsan",
    password: "vatsan16",
    mail_Id: "srivathsansenthil16@gmail.com",
    first_name: "Shri",
    last_name: "Vathsan",
    age: 19,
    gender: "Male",
    phone_no: "7892227568",
    college: "Amrita Vishwa Vidhyapeetham",
    state: "Kerala"
})
queries.insertAdmin({
    user_id: "eswarkamalesh",
    password: "eswarkamalesh",
    mail_id: "eswarmuthu3@gmail.com",
    first_name: "Eswar",
    last_name: "M",
    age: 20,
    gender: "Male",
    phone_no: "9994455666",
    college: "Amrita Vishwa Vidhyapeetham",
    state: "Tamil Nadu",
    room_id:"Vatsan"
})
queries.insertUser({
    user_id: "vish_2000",
    password: "Vsr_2000",
    mail_id: "vishakharamaswamy2000@gmail.com",
    first_name: "Vishakha",
    last_name: "Nadar",
    age: 20,
    gender: "Female",
    phone_no: "8940016104",
    college: "Amrita Vishwa Vidhyapeetham",
    state: "Tamil Nadu",
    room_id:"Vatsan"
})
queries.insertUser({
    user_id: "ashokvippala21",
    password: "ashokvippala21",
    mail_id: "ashokvippala21@gmail.com",
    first_name: "Ashok",
    last_name: "Reddy",
    age: 21,
    gender: "Male",
    phone_no: "9493592299",
    college: "Amrita Vishwa Vidhyapeetham",
    state: "Andhra Pradesh",
    room_id:"Vatsan"
})*/
router.get('/forgot_pwd', (req, res) => {
    res.render('forget_pwd')
})
router.post('/email_auth', urlencodedparser, (req, res) => {
    var mail_id = req.body.Email
    queries.getAdminId(mail_id, (result) => {
        if (result.length > 0) {
            var verific_code = forgotpwd(result[0].mail_id)
            req.session.verific_code = verific_code
            req.session.username = result[0].user_id
            req.session.type = 'admin'
            res.render('verification')
        } else {
            queries.getUserId(mail_id, (result1) => {
                if (result1.length > 0) {
                    var verific_code = forgotpwd(result1[0].mail_id)
                    req.session.verific_code = verific_code
                    req.session.username = result1[0].user_id
                    req.session.type = 'faculty'
                    res.render('verification')
                } else {
                    var error2 = [{
                        msg: "Enter a valid Mail ID"
                    }]
                    res.render('forget_pwd', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
                    return
                }
            })
        }
    })
})
router.post('/verify_code', urlencodedparser, (req, res) => {
    if (req.session.verific_code == req.body.verific_code) {
        res.render('update_pwd')
    } else {
        var error2 = [{
            msg: "Wrong Verification Code"
        }]
        res.render('forget_pwd', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
        return
    }
})
router.post('/update_pwd', urlencodedparser, [check('Password', 'Password length should be 8 to 10 characters').isLength({ min: 8, max: 20 })],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            res.render('', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: errors["errors"] })
        } else {
            if (req.session.type == 'admin') {
                queries.updateAdminPass(req.session.username, req.body.Password)
                req.session.loggedIn = true
                res.redirect('/home')
            } else {
                queries.updateUserPass(req.session.username, req.body.Password)
                req.session.loggedIn = true
                res.redirect('/home')
            }
        }
    })
router.post('/admin_auth', urlencodedparser, (req, res) => {
    var username = req.body.username
    var password = req.body.password
    console.log(username, password)
    if (username && password) {
        result = queries.findAdmin(username, password, (result) => {
            if (result.length > 0) {
                req.session.loggedIn = true
                req.session.username = username
                req.session.isAdmin=true
                res.redirect('/home')
            } else {
                var error2 = [{
                    msg: "Invalid Username or password"
                }]
                res.render('admin_signup', { isWrong: true, errors: error2 })
            }
        })
    } else {
        var error2 = [{
            msg: "Invalid Username or password"
        }]
        res.render('admin_signup', { isWrong: true, errors: error2 })
    }
})
router.post('/user_auth', urlencodedparser, (req, res) => {
    var username = req.body.username
    var password = req.body.password
    if (username && password) {
        result = queries.findUser(username, password, (result) => {
            if (result.length > 0) {
                req.session.loggedIn = true
                req.session.username = username
                req.session.isAdmin=false
                res.redirect('/home')
            } else {
                var error2 = [{
                    msg: "Invalid Username or password"
                }]
                res.render('faculty_signup', { isWrong: true, errors: error2 })
            }
        })
    } else {
        var error2 = [{
            msg: "Invalid Username or password"
        }]
        res.render('faculty_signup', { isWrong: true, errors: error2 })
    }
})
router.post('/submit_admin_signup', urlencodedparser, [
    check('username', 'Username should be 5 to 20 characters').isLength({ min: 5, max: 20 }),
    check('email_id', 'Email length should be 10 to 30 characters').isEmail().isLength({ min: 10, max: 30 }).normalizeEmail(),
    check('first_name', 'first Name length should be 1 to 20 characters').isLength({ min: 1, max: 20 }),
    check('last_name', 'last length should be 1 to 20 characters').isLength({ min: 0, max: 20 }),
    check('phone_no', 'Mobile number should contains 10 digits').isLength({ min: 10, max: 10 }).isNumeric(),
    check('age', 'Age should not be less than ').isNumeric(),
    check('password', 'Password length should be 8 to 10 characters').isLength({ min: 8, max: 20 }),
    check('state', 'State length should be 1 to 20 characters').isLength({ min: 1, max: 20 }),
    check('clg_name', 'College Name length should be 5 to 30 characters').isLength({ min: 5, max: 30 }),

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        res.render('admin_signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: errors["errors"] })
    } else {
        if (req.body.age <= 18 || req.body.age >= 100) {
            var error2 = [{
                msg: "Enter a valid age"
            }]
            res.render('admin_signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
            return
        }
        queries.checkAdmin(req.body.username, function (results) {
            if (results.length > 0) {
                var error2 = [{
                    msg: "User Name already taken!!!"
                }]
                res.render('admin_signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
            } else {

                let post = {
                    user_id: req.body.username,
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    state: req.body.state,
                    gender: req.body.gender,
                    age: req.body.age,
                    phone_no: req.body.phone_no,
                    mail_id: req.body.email_id,
                    clg_name: req.body.clg_name
                }
                console.log(post)
                queries.insertAdmin(post)
                req.session.loggedIn = true
                req.session.username = req.body.username
                res.redirect("/auth/google")
            }

        });

    }
});

router.post('/submit_faculty_signup', urlencodedparser, [
    check('username', 'Username should be 5 to 20 characters').isLength({ min: 5, max: 20 }),
    check('email_id', 'Email length should be 10 to 30 characters').isEmail().isLength({ min: 10, max: 30 }).normalizeEmail(),
    check('first_name', 'first Name length should be 1 to 20 characters').isLength({ min: 1, max: 20 }),
    check('last_name', 'last length should be 1 to 20 characters').isLength({ min: 0, max: 20 }),
    check('phone_no', 'Mobile number should contains 10 digits').isLength({ min: 10, max: 10 }).isNumeric(),
    check('age', 'Age should not be less than ').isNumeric(),
    check('password', 'Password length should be 8 to 10 characters').isLength({ min: 8, max: 20 }),
    check('state', 'State length should be 1 to 20 characters').isLength({ min: 1, max: 20 }),
    check('clg_name', 'College Name length should be 5 to 30 characters').isLength({ min: 5, max: 30 }),

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        res.render('faculty_signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: errors["errors"] })
    } else {
        if (req.body.age <= 18 || req.body.age >= 100) {
            var error2 = [{
                msg: "Enter a valid age"
            }]
            res.render('faculty_signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
            return
        }
        queries.checkUser(req.body.username, function (results) {
            if (results.length > 0) {
                var error2 = [{
                    msg: "User Name already taken!!!"
                }]
                res.render('faculty_signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
            } else {
                queries.checkAdmin(req.body.room_id, function (results1) {
                    if (results1.length > 0) {
                        let post = {
                            user_id: req.body.username,
                            password: req.body.password,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            state: req.body.state,
                            gender: req.body.gender,
                            age: req.body.age,
                            phone_no: req.body.phone_no,
                            mail_id: req.body.email_id,
                            clg_name: req.body.clg_name,
                            event:[],
                            timetable:[],
                            slot_timings:[],
                            room_id: req.body.room_id
                        }
                        console.log(post)
                        queries.insertUser(post)
                        req.session.loggedIn = true
                        req.session.username = req.body.username
                        res.redirect("/auth/google")
                    } else {
                        var error2 = [{
                            msg: "Room ID not valid!!!"
                        }]
                        res.render('faculty_signup', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2 })
                    }
                })

            }

        });

    }
});
router.get('/faculty_login', (req, res) => {
    res.render('faculty_signup')
})
router.get('/faculty_signup', (req, res) => {
    res.render('faculty_signup')
})
router.get('/admin_signup', (req, res) => {
    res.render('admin_signup')
})
router.get('/admin_login', (req, res) => {
    res.render('admin_signup')
})
router.get('/login', (req, res) => {
    res.render('login')
})
// -----XXX----
router.get('/modify', (req, res) => {
    var username = req.session.username
    if (username) {
        res.render('modify', { isLoggedIn: req.session.loggedIn, username: req.session.username, isWrong: false, mail_id: req.session.mail_id, first_name: req.session.first_name, last_name: req.session.last_name, age: req.session.age, gender: req.session.gender, phone_no: req.session.phone_no, college: req.session.college, state: req.session.state,isAdmin:req.session.isAdmin })
    }
    else {
        res.redirect('/login')
    }
})
router.get('/profile', (req, res) => {
    var username = req.session.username
    if (username) {
        result = queries.getuserdetails(username, (result) => {
            if (result.length > 0) {
                req.session.loggedIn = true
                req.session.username = username
                req.session.mail_id = result[0].mail_id
                req.session.first_name = result[0].first_name
                req.session.last_name = result[0].last_name
                req.session.age = result[0].age
                req.session.gender = result[0].gender
                req.session.phone_no = result[0].phone_no
                req.session.college = result[0].college
                req.session.state = result[0].state
                res.render('profile', { isLoggedIn: req.session.loggedIn, username: req.session.username, mail_id: req.session.mail_id, first_name: req.session.first_name, last_name: req.session.last_name, age: req.session.age, gender: req.session.gender, phone_no: req.session.phone_no, college: req.session.college, state: req.session.state,isAdmin:req.session.isAdmin })
            } else {
                res.redirect('/home')
            }
        })
    } else {
        res.redirect('/login')
    }
})
router.post('/save', urlencodedparser, [
    check('username', 'Username should be 5 to 20 characters').isLength({ min: 5, max: 20 }),
    check('mail_id', 'Email length should be 10 to 30 characters').isEmail().isLength({ min: 10, max: 30 }).normalizeEmail(),
    check('first_name', 'first Name length should be 1 to 20 characters').isLength({ min: 1, max: 20 }),
    check('last_name', 'last length should be 1 to 20 characters').isLength({ min: 0, max: 20 }),
    check('phone_no', 'Mobile number should contains 10 digits').isLength({ min: 10, max: 10 }).isNumeric(),
    check('age', 'Age should not be less than 18').isNumeric(),
    check('state', 'State length should be 1 to 20 characters').isLength({ min: 1, max: 20 }),
    check('college', 'College Name length should be 5 to 30 characters').isLength({ min: 5, max: 30 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        res.render('modify', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: errors["errors"], mail_id: req.session.mail_id, first_name: req.session.first_name, last_name: req.session.last_name, age: req.session.age, gender: req.session.gender, phone_no: req.session.phone_no, college: req.session.college, state: req.session.state })
    } else {
        if (req.body.age <= 18 || req.body.age >= 100) {
            var error2 = [{
                msg: "Enter a valid age"
            }]
            res.render('modify', { username: req.session.username, isLoggedIn: req.session.loggedIn, isWrong: true, errors: error2, mail_id: req.session.mail_id, first_name: req.session.first_name, last_name: req.session.last_name, age: req.session.age, gender: req.session.gender, phone_no: req.session.phone_no, college: req.session.college, state: req.session.state })
            return
        }
        queries.updateUserdetails(req.body.username, req.body.mail_id, req.body.first_name, req.body.last_name, req.body.age, req.body.gender, req.body.phone_no, req.body.state, req.body.college)
        result = queries.getuserdetails(req.body.username, (result) => {
            req.session.loggedIn = true
            req.session.username = result[0].user_id
            req.session.mail_id = result[0].mail_id
            req.session.first_name = result[0].first_name
            req.session.last_name = result[0].last_name
            req.session.age = result[0].age
            req.session.gender = result[0].gender
            req.session.phone_no = result[0].phone_no
            req.session.college = result[0].college
            req.session.state = result[0].state
            res.render('profile', { isLoggedIn: req.session.loggedIn, username: req.session.username, mail_id: req.session.mail_id, first_name: req.session.first_name, last_name: req.session.last_name, age: req.session.age, gender: req.session.gender, phone_no: req.session.phone_no, college: req.session.college, state: req.session.state,isAdmin:req.session.isAdmin })
        })
    }
});
router.get('/admin_dashboard', (req, res) => {
    var room_id = req.session.username
    queries.getusers(room_id, (result) => {
        console.log(result)
        req.session.users=result
        res.render('admin_dashboard', { isLoggedIn: req.session.loggedIn, username: req.session.username, users: req.session.users ,isAdmin:req.session.isAdmin})
    })
});
router.get('/faculty_dashboard',(req,res)=>{
    res.render('faculty_dashboard',{ isLoggedIn: req.session.loggedIn, username: req.session.username,isAdmin:req.session.isAdmin})
})
router.get('/user_detail/:user_id', (req, res) => {
    var username = req.session.username
    if (username) {
        result = queries.getuserdetails(req.params.user_id, (result) => {
            if (result.length > 0) {
                req.session.loggedIn = true
                req.session.username = username
                req.session.faculty=result[0].user_id
                req.session.mail_id = result[0].mail_id
                req.session.first_name = result[0].first_name
                req.session.last_name = result[0].last_name
                req.session.age = result[0].age
                req.session.gender = result[0].gender
                req.session.phone_no = result[0].phone_no
                req.session.college = result[0].college
                req.session.state = result[0].state
                res.render('user_detail', { isAdmin:req.session.isAdmin,isLoggedIn: req.session.loggedIn, username: req.session.username,faculty:req.session.faculty, mail_id: req.session.mail_id, first_name: req.session.first_name, last_name: req.session.last_name, age: req.session.age, gender: req.session.gender, phone_no: req.session.phone_no, college: req.session.college, state: req.session.state ,users: req.session.users})
                return;
            } else {
                res.redirect('/home')
            }
        })
    } else {
        res.redirect('/login')
    }
});
router.get('/add_event', (req, res) => {
    var room_id = req.session.username
    queries.getusers(room_id, (result) => {
        console.log(result)
        req.session.users=result
        res.render('add_event', { isLoggedIn: req.session.loggedIn, username: req.session.username, users: req.session.users })
    })
});
module.exports = router;