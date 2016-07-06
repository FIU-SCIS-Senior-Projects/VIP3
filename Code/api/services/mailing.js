
var User = require('../models/users'),
    Support = require('../models/support'),
    nodemailer = require("nodemailer")


var headers = {
    accountPinRecovery: "0xAccountPinRecovery"
},
    pinRecoveryMailExpiry = 1000 * 3600 * 1,
    SMTP_config = {
        service: "Gmail",
        auth: {
            user: 'fiuvipmailer@gmail.com',
            pass: 'vipadmin123'
        }
    },
    SMTP_Transport = nodemailer	.createTransport('smtps://fiuvipmailer%40gmail.com:vipadmin123@smtp.gmail.com');
  // SMTP_Transport = nodemailer.createTransport('smtps://visualnet2008@gmail.com:20001142h@smtp.gmail.com');
	//SMTP_Transport = nodemailer.createTransport('smtps://vvega019@fiu.edu:Vega2016-@smtp.gmail.com');
var CONFIG = {
    Sender: 'fiuvipmailer@gmail.com'
};

exports.sendPinRecoveryCode = function (user_token, SCCallback, ERCallback) {

    if (!SCCallback) SCCallback = function () { }; if (!ERCallback) ERCallback = function () { };

    User.findById(user_token.valueOf(), function (err, user) {

        if (err) {
            throw err
        }

        if (user) {

           var object = {}
            object.user_id = user_token
            object.header = headers.accountPinRecovery
            object.verifyCode = _CREATE__VERIFICATION___CODE().toString()
            object.date = Date.now()

            /*var content = "http://45.32.254.22:3000/#/password_request?auth_id=" + object.user_id + "&code=" + object.verifyCode*/
            var content = "Dear VIP user, you received this email in order to a password reset request. Please click on the link below, or copy and paste it into your web browser to proceed: http://vip.fiu.edu/#/password_request?auth_id=" + object.user_id + "&code=" + object.verifyCode

            var mailOptions = {
                from: CONFIG.Sender,
                to: user.email,
                subject: "Account Password Recovery",
                text: content,
                html: content
            };

            EXEC_EMAIL(mailOptions, function () {
                Support.update({ user_id: user_token }, object, { upsert: true }, function (err) {
                    if (err) {
                        throw err
                    }
                })
            }, ERCallback)                          
	
        }
        else
            ERCallback()

    })
};

exports.verifyPinRecoveryCode = function (user_token, verificationCode, SCCallback, ERCallback) {

    console.log(user_token, verificationCode)

    if (!SCCallback) SCCallback = function () { }; if (!ERCallback) ERCallback = function () { };

    var query = {
        user_id: user_token,
        header: headers.accountPinRecovery,
        verifyCode: verificationCode
    };
    Support.findOne(query, function (err, support_request) {
        if (err) {
            throw err
        }

        if (support_request) {
            if ((support_request.date + pinRecoveryMailExpiry) > Date.now())
                SCCallback();
            else {
                ERCallback({ e: 'expired_code' })
            }
        }
        else
            ERCallback()
    })
};

exports._EXEC_EMAIL_FUNC = function (options, SCCallback, ERCallback) {
    EXEC_EMAIL(options, SCCallback, ERCallback);
};

function _CREATE__VERIFICATION___CODE() {
    var code = Math.floor(Math.random() * 1000000);

    if (code.toString().length < 6)
        code = _CREATE__VERIFICATION___CODE();

    return code;
}



function EXEC_EMAIL(options, SCCallback, ERCallback) {

    console.log('sending mail to', options.to);

    SMTP_Transport.sendMail(options, function (err, res) {

        console.log("ERR:", err);
        console.log("RES:", res);

        if (err) {
            if (ERCallback)
                ERCallback();
        }
        else {
            if (SCCallback)
                SCCallback(res)
        }
    })
}
