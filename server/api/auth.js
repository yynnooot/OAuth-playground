const router = require('express').Router();

const { User } = require('../db/models');

const passport = require('passport')
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

require('dotenv').config();

// API Access link for creating client ID and secret:
// https://www.linkedin.com/secure/developer
var LINKEDIN_CLIENT_ID = process.env.clientId;
var LINKEDIN_CLIENT_SECRET = process.env.clientSecret;
console.log('PROCESS', process.env )

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Linkedin profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the LinkedinStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Linkedin
//   profile), and invoke a callback with a user object.
passport.use(new LinkedinStrategy({
  clientID:     LINKEDIN_CLIENT_ID,
  clientSecret: LINKEDIN_CLIENT_SECRET,
  callbackURL:  "/auth/linkedin/callback",
  scope:        [ 'r_basicprofile', 'r_emailaddress'],
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  req.session.accessToken = accessToken;
  process.nextTick(function () {
    // To keep the example simple, the user's Linkedin profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the Linkedin account with a user record in your database,
    // and return that user instead.
      return done(null, profile);
    });
  }
));

router.get('/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE' }),
  function(req, res){
    // The request will be redirected to Linkedin for authentication, so this
    // function will not be called.
  });

// GET /auth/linkedin/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);
  // ,
  // function(req, res) {
  //   res.redirect('/');
  // });

module.exports = router;