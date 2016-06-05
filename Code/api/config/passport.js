var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/users');
var configAuth = require('./auth');
module.exports = function(passport) {
   passport.serializeUser(function (user, done) {
       done(null, user.id);
   });
   passport.deserializeUser(function (id, done) {
       User.findById(id, function(err, user) {
           done(err, user);
       })
   });

   passport.use(new LocalStrategy({
        usernameField : "email",
        passwordField : "password",
    },
        function(username, password, done) {
            User.findOne({'email': username}, function(err, user) {
                if (err) {return done(err); }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username/password.' });
                }
                if (!user.comparePassword(password)) {
                    return done(null, false, {message: 'Incorrect username/password.' });
                }
                return done(null, user);
            });
        }
    ));

   passport.use(new GoogleStrategy( {
       clientID        : configAuth.googleAuth.clientID,
       clientSecret    : configAuth.googleAuth.clientSecret,
       callbackURL     : configAuth.googleAuth.callbackURL
   },
   function(token, refreshToken, profile, done) {
       // make the code asynchronous
       // User.findOne won't fire until we have all our data back from Google
       if(profile.emails[0].value.indexOf('@fiu.edu') > -1) {
           process.nextTick(function () {
               // try to find the user based on their google id
               User.findOne({'google.id': profile.id}, function (err, user) {
                   if (err)
                       return done(err);
                   if (user) {
                       // if a user is found, log them in
                       //console.log('found user' , user);
                       return done(null, user);
                   }
                   else {
                       // if the user isnt in our database, create a new user
                       var newUser = new User();
                       // set all of the relevant information.
                       newUser.google.id = profile.id;
                       newUser.google.token = token;
                       newUser.google.name = profile.displayName;
                       newUser.firstName = profile._json.name.givenName;
                       newUser.lastName = profile._json.name.familyName;
                       newUser.email = profile._json.emails[0].value;
                       newUser.image = profile._json.image.url;
                       newUser.google.email = profile.emails[0].value; // pull the first email
                       // save the user
                       newUser.save(function (err)
                       {
                          if (err)

                              console.log(err);
                           //console.log(newUser);
                           return done(null, newUser);

                       });
                   }
               });
           });
       }
       else {
           done(new Error("Invalid email"));
       }
   }));
};