//Includes
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser    = require('body-parser');
var nodemailer      = require('nodemailer');

//Models
var User          = require('../models/users');

module.exports = function (app, express) {

    //Google+ Authentication
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: 'http://localhost:3000/#/profile',
            failureRedirect: 'http://localhost:3000/#/login'
        })
    );


    passport.serializeUser(function(user, done) {
        done(null, {
            id: user.id,
            email: user.email,
            firstName: user.firstName
        });
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/#/profile',
            failureRedirect: '/#/login',
            failureFlash: true })
    );

    /* FOR LOGOUT IMPLEMENTATION
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
    */

    var userRouter = express.Router();



    // for email verification
    userRouter.route('/verifyEmail/:user_id')

        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if( user == null)
                {
                    res.json('Invalid link. Email cannot be verified.');
                    return;
                }

                user.verifiedEmail = true; // set the email verified attribute in the model to true
                // save the user
                user.save(function(err) {
                    if (err) res.send(err);
                    else {
                        res.redirect("/#emailVerified");
                    }

                   // res.json({message: 'Error, this user is not a pending student, faculty, staff or PI'})
                });
            });
        })

    userRouter.route('/nodeemail')
        .post(function(req, res) {
            var recipient = req.body.recipient;
            var text = req.body.text;
            var subject = req.body.subject;


            var recipient2 = req.body.recipient2;
            var text2 = req.body.text2;
            var subject2 = req.body.subject2;



            var transporter = nodemailer.createTransport({
                service:'Gmail',
                auth: {
                    user: 'fiuvipmailer@gmail.com',
                    pass: 'vipadmin123'
                }
            });


            var mailOptions = {
                from: 'FIU VIP <vipadmin@fiu.edu>', // sender address
                to: recipient, // list of receivers
                subject: subject, // Subject line
                text: text
            };
            console.log(mailOptions);
            // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error) {
                        return console.log(error);
                    }
            });


            var mailOptions2 = {
                from: 'FIU VIP <vipadmin@fiu.edu>', // sender address
                to: recipient2, // list of receivers
                subject: subject2, // Subject line
                text: text2
            };

            console.log(mailOptions2);

            // send mail with defined transport object
            transporter.sendMail(mailOptions2, function(error, info){
                if(error) {
                    return console.log(error);
                }
            });



})

    userRouter.route('/users')

        .post(function (req, res) {

            var user = new User();

            user.firstName     = req.body.firstName;  // set the users name (comes from the request)
            user.lastName     = req.body.lastName;  // set the users last name
            user.pantherID        = req.body.pantherID;     // set the users panther ID
            user.password   = req.body.password;  // set the users password (comes from the request)
            user.passwordConf = req.body.passwordConf;
            user.email      = req.body.email;   // sets the users email
            user.project    = req.body.project; // sets the users project
            user.rank       = req.body.rank;    // set the users Rank within the program
            user.college      = req.body.college;   // sets the users college
            user.department      = req.body.department;  // sets the users college
            user.piApproval = req.body.piApproval;
            user.piDenial = req.body.piDenial;
            user.verifiedEmail = req.body.verifiedEmail;
            user.googleKey = " ";
            user.userType = req.body.userType;
            user.gender = req.body.gender;

            user.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({success: false, message: 'A user already exists.'});
                    else
                        return res.send(err);

                }

                // return the object id for validation and message for the client
                res.json({ objectId: user._id, message: 'Please verify your email.' });
            });
        });

    return userRouter;
};
