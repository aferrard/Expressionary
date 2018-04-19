var nodemailer = require('nodemailer');
var Connection = require(__dirname + "/Connection.js");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'expressionary307@gmail.com',
        pass: 'sameastheusername'
    }
});

var mailOptions = {
    from: 'expressionary307@gmail.com',
    to: 'michaeljquade@gmail.com',
    subject: 'Confirmation',
    text: 'TEST'
};
exports.sendEmail = sendEmail;
function sendEmail(address, message) {
    mailOptions.to = address;
    mailOptions.text = message;
    Connection.getSubscriptionbyEmail(address,function (result) {
        if (result == "failure"){

        }else{
            if (result == 1){ // subscribed
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }
    })


}