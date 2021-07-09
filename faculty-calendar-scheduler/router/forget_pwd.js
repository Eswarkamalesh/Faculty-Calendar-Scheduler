const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const forgotpwd = function(mail_id) {
    var Verification_code = Math.floor(100000 + Math.random() * 900000);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fcss.reset@gmail.com',
            pass: 'fcss1234'
        }
    });

    var mailOptions = {
        from: 'fcss.reset@gmail.com',
        to: mail_id,
        subject: 'Password Reset',
        text: 'Verification Code: ' + Verification_code.toString()
    }

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('email sent' + info.response);
        }
    })
    return Verification_code
}
module.exports = forgotpwd