// load the things we need
var express = require('express');

var post = {
    post_id: undefined,
    date: undefined,
    points: undefined,
    definition: undefined,
    users_user_id: undefined,
    wordPage_wp_id: undefined
};

var app = express();
var Mail = require(__dirname + "/Controllers/Mail.js");
var Word = require(__dirname + "/Controllers/Word.js");
var Connection = require(__dirname + "/Controllers/Connection.js");
var bodyParser = require('body-parser');
var mysql = require('mysql');
var word = "pizza";
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "shittyreddit",
    database: "expressionary_data"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

});


//con.query("INSERT INTO wordpage (word, totalPoints) VALUES ('pizza', 0)");


// var z = Connection.getwpFromWord("pizza");
// console.log(z);

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
app.get('/word', function(req, res) {
    // var p;
    Connection.getwpFromWord(word, function(wpid) {
        if (wpid === undefined) {
            console.log("ERROR");
        }
        else {
            console.log(wpid);
            Connection.getPostsFromWordId(wpid, function(posts) {
                if (posts === undefined) {
                    console.log("ERROR");
                }
                else {
                    // p = posts;
                    console.log(posts);
                    posts[0].username = "billy";
                    res.render('pages/word', {word: word, posts: posts});
                }

            })
        }
    });

    //res.render('pages/word', {word: word, posts: p});
})
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
