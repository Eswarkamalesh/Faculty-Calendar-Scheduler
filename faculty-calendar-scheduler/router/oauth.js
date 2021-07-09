const express = require('express')
const session = require('express-session');
const path = require('path')
const hbs = require('hbs')
const queries = require('./db_queries')
const router = express.Router()

router.get('/oauth', function(req, res) {
    res.render('auth');
});
/*  PASSPORT SETUP  */
const passport = require('passport');
var userProfile;
var refreshtoken;
router.get('/success', (req, res) => res.send({ userProfile, refreshtoken }));
router.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

/*  Google AUTH  */

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '957946762556-nhq84b6go8ai5cb1fg3erucule3uaek2.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'wuVGqqb34Z0GjWMP89H8aipn';
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done) {
        userProfile = profile;
        refreshtoken = refreshToken
        return done(null, userProfile, refreshToken);
    }
));
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/calendar', 'profile', 'email'],
        accessType: 'offline',
        prompt: 'consent'
    }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
        // Successful authentication, redirect success.
        let prevSession = req.session;
        queries.updateUserToken(req.session.username, refreshtoken, userProfile)
        req.session.regenerate((err) => { // Compliant
            Object.assign(req.session, prevSession);
            res.redirect('/home');
        });
    });
module.exports = router