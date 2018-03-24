// load the things we need
var express = require('express');
var array = [];


var app = express();
var Mail = require(__dirname + "/Controllers/Mail.js");
var Word = require(__dirname + "/Controllers/Word.js");
var Connection = require(__dirname + "/Controllers/Connection.js");
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookie);


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "expressionary_data"
});


exports.logcheck = logcheck;
function logcheck(user,cb){
    if (array.indexof(user) > -1){
        cb(true);
    }else {
        cb(false);
    }
}

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

});

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/search', function(req,res) {
    res.render('pages/search');
});

app.post('/', function(req, res) {
    var email = req.body.email;
    Connection.addMailingList(email, function() {
        Mail.sendEmail(email, "You have subscribed to the Expressionary Newsletter");
        res.render('pages/index');
    });
    //add to mailing list table
});

app.get('/wordlist', function(req,res) {
    Connection.getWordPages(function(wordPages) {
        res.render('pages/wordlist', {wordPages: wordPages});
    })
});

app.post('/wordlist', function(req,res) {
    var word = req.body.word;
    Connection.getwpFromWord(word, function(wpid) {
        Connection.getPostsFromWordId(wpid, function(posts) {
            res.render('pages/word', {word: word, posts: posts});
        })
    })
});

app.post('/word2', function(req, res) {
    if (req.cookies.user != undefined){
    var word = req.body.theWord;
    Connection.getwpFromWord(word, function(wpid) {
        Connection.getPostsFromWordId(wpid, function(posts) {

    if (!(req.body.vote0 === undefined)) {
        var i = 0;
        var vote = req.body.vote0;
        var post = req.body.thePost[i];
        var points = req.body.points[i];

        //console.log(vote);
        console.log(points);
        console.log(post);
        if (vote == '+') {
            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        console.log("hello+");
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
            //console.log("hello1");

        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        console.log("hello+");
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        //console.log("test");
        //res.redirect('/word2');
    }
    else if (!(req.body.vote1 === undefined)) {
        var i = 1;
        var vote = req.body.vote1;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
            
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote2 === undefined)) {
        var i = 2;
        var vote = req.body.vote2;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote3 === undefined)) {
        var i = 3;
        var vote = req.body.vote3;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {

            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote4 === undefined)) {
        var i = 4;
        var vote = req.body.vote4;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {

            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote5 === undefined)) {
        var i = 5;
        var vote = req.body.vote5;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {

            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote6 === undefined)) {
        var i = 6;
        var vote = req.body.vote6;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {

            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote7 === undefined)) {
        var i = 7;
        var vote = req.body.vote7;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {

            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote8 === undefined)) {
        var i = 8;
        var vote = req.body.vote8;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {

            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote9 === undefined)) {
        var i = 9;
        var vote = req.body.vote9;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {

            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }else if (!(req.body.vote10 === undefined)) {
        var i = 10;
        var vote = req.body.vote10;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {

            Connection.addPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
        else if (vote == '-') {
            Connection.subPointToPost(post, points, function(result) {
                if(result == "success"){
                    Connection.getPostsFromWordId(wpid, function(post) {
                        res.render('pages/word', {word: req.body.theWord, posts: post});
                    });
                }else{
                    console.log("failure to vote")
                }
            })
        }
    }
    else {
        console.log("hi");
    }
        //res.render('pages/word', {word: word, posts: posts});
        })
    })
    }else {
        res.render("pages/registration",{regError: "Please Register or Log In"});
    }
});

app.post('/word', function(req, res) {
    var definition = req.body.newDef;
    //'1000-01-01'
    Connection.getwpFromWord(req.body.theWord, function(wpid) {
        con.query("INSERT INTO posts VALUE (NULL, NOW(), 0, '" + definition + "', 1, " + wpid + ");", function(err, result) {
            if (err) throw err;
            else {
                console.log(result);
                Connection.getPostsFromWordId(wpid, function (posts) {
                    res.render('pages/word', {word: req.body.theWord, posts: posts});
                })
            }
        })
    })
});

app.post('/search', function(req,res) {
    var term = req.body.search;
    var type = req.body.searchType;
    if (type == "Word") {
        //search database for words
        con.query("SELECT * FROM wordPage WHERE word = '" + term + "'", function(err, result) {
            if (err) throw err;
            var word = JSON.parse(JSON.stringify(result[0].word));
            Connection.getwpFromWord(term, function (wpid) {
                if (wpid === undefined) {
                    console.log("ERROR");
                }
                else {
                    console.log(wpid);
                    Connection.getPostsFromWordId(wpid, function (posts) {
                        if (posts === undefined) {
                            console.log("ERROR");
                        }
                        else {
                            // p = posts;
                            console.log(posts);
                            for (var i = 0; i < posts.length; i++) {
                                Connection.getUsernameByPost(posts[i], function(username) {
                                    //console.log("USERNAME AGAIN: " + username);
                                    //userz[i] = username;
                                    //console.log(userz[0]);
                                    // posts[i].username = "barryuser";
                                })
                            }

                            res.render('pages/word', {word: word, posts: posts});
                        }

                    })
                }
            });
        })
    }
    else if (type == "User") {
        Connection.findUserByUsername(term, function(user) {
            res.render('pages/profile', {username: user.username, points: user.points,
            first_name: user.first_name, last_name: user.last_name});
        })
    }
    else {
        res.render('/pages/search');
    }
    console.log(term);
    console.log(type);

});

// about page 
app.get('/contact', function(req, res) {
	res.render('pages/contact');
});

app.get('/register', function(req, res) {
    res.render('pages/registration',{regError: ""});
});


app.get('/action_page.php', function (req,res){

    if (req.cookies.user != undefined || array.indexOf(req.query.uname) != -1){
        res.render("pages/registration",{regError: "User Already Logged In"});
        return;
    }
    Connection.getPassword(req.query.uname,function (result){
        if (result == 'user not found'){
            res.render("pages/registration",{regError: "User Doesn't Exist"});
        }else {
            array.push(req.query.uname);
            res.cookie('user', req.query.uname , {maxAge: 60000});
            res.cookie('password', req.query.psw, {maxAge: 60000});
            //app.post(res.render("pages/registration",{regError: "Login Successful"}))
            res.render("pages/registration",{regError: "Login Successful"});
        }
    });

});

app.post('/register', function (req,res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    Connection.registerUser(email,username,password,firstname,lastname,function (result){
        if (result=="failure registering user"){
            res.render('pages/registration',{regError: "Username already exists.Please try again"});
        }
        if (result!="failure registering user"){
            res.render('pages/registration',{regError: "Successfully registered user"})
        }
    })
});
app.get('/user', function(req, res) {
    res.render('pages/user')
});
app.get('/random', function(req, res) {
    var userz = [];
	Connection.getWordPages(function(wordPages) {
	    var i = Math.floor(Math.random() * wordPages.length);
	    // wordPage(wordPages[i].word); // maybe need cb
        var word = wordPages[i].word;
            Connection.getwpFromWord(word, function (wpid) {
                if (wpid === undefined) {
                    console.log("ERROR");
                }
                else {
                    console.log(wpid);
                    Connection.getPostsFromWordId(wpid, function (posts) {
                        if (posts === undefined) {
                            console.log("ERROR");
                        }
                        else {
                            // p = posts;
                            console.log(posts);
                            for (var i = 0; i < posts.length; i++) {
                                Connection.getUsernameByPost(posts[i], function(username) {
                                })
                            }
                            res.render('pages/word', {word: word, posts: posts});
                        }

                    })
                }
            });



    })
    //wordPage("pizza");
});

app.get('/developer', function(req, res) {
	res.render('pages/developer');
});
app.post('/contact', function(req, res) {
    var name = req.body.name;
     var email = req.body.email;
     var message = req.body.message;
     message = "NAME: " + name + "\nEMAIL: " + email + "\nMESSAGE: " + message;
    Mail.sendEmail("expressionaryproject@gmail.com", message);
     console.log(name + email + message);
     res.render('pages/index');
});

app.listen(8080);
console.log('8080 is the magic port');
