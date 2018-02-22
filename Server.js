// load the things we need
var express = require('express');
var app = express();
var Mail = require(__dirname + "/Controllers/Mail.js");
var bodyParser = require('body-parser');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "databases.000webhost.com",
    user: "id4830013_exp",
    password: "shittyreddit"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
	res.render('pages/index');

});

// about page 
app.get('/contact', function(req, res) {
	res.render('pages/contact');
});
app.get('/random', function(req, res) {
	//go through words
	//temporary to test below
	var word = "pizza";
	var definitions = ["hi", "sloot", "pizzaman"];
	res.render('pages/word', {word: word, definitions: definitions});
});
app.get('/developer', function(req, res) {
	res.render('pages/developer');
})
app.post('/contact', function(req, res) {
    var name = req.body.name;
     var email = req.body.email;
     var message = req.body.message;
    Mail.sendEmail(email, message);
     console.log(name + email + message);
     res.render('pages/index');
})

app.listen(8080);
console.log('8080 is the magic port');