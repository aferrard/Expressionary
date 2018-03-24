var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ExpressionaryProject@gmail.com',
        pass: 'shittyreddit'
    }
});

var mailOptions = {
    from: 'ExpressionaryProject@gmail.com',
    to: 'michaeljquade@gmail.com',
    subject: 'test',
    text: 'my life sucks'
};
exports.sendEmail = sendEmail;
function sendEmail(address, message) {
    mailOptions.to = address;
    mailOptions.text = message;
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}
