const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require("cors");

const authRouter = express.Router();
authRouter.use(cors());

authRouter.get("/", (req, res) => {
    res.send("Google OAuth");
})

authRouter.get('/login', function (req, res, next) {
    res.render('login');
});

authRouter.use(cookieParser());

// Use express-session middleware
authRouter.use(session({
       secret: 'your_secret_key',
       resave: false,
       saveUninitialized: false
}));

// Initialize Passport and restore authentication state, if any, from the session
authRouter.use(passport.initialize());
authRouter.use(passport.session());

// Set up Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: '473334704297-84k62o5538rdfjumvg33pmk13di5ibe9.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/oauth2/redirect/google',
}, (accessToken, refreshToken, profile, done) => {
    // Save user information to database or session
    return done(null, profile);
}));

// Serialize and deserialize user information
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

// Redirect the user to Google for authentication
authRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Handle the response from Google
authRouter.get('/oauth2/redirect/google', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    // Successful authentication, redirect to protected route
    // res.sendFile(path.join(__dirname, '../../frontend/html/dashboard.html'));
    res.json({success: true});
});

authRouter.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Example of a protected route
authRouter.get('/profile', (req, res) => {
       console.log(req.user);
       res.send(`Welcome, ${req.user.displayName}!`);
});

// module.exports = {authRouter};