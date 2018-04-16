// load the things we need
var express = require('express');
var HashMap = require('hashmap');
var Mail = require(__dirname + "/Controllers/Mail.js");
var Word = require(__dirname + "/Controllers/Word.js");
var Connection = require(__dirname + "/Controllers/Connection.js");
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var randomstring = require ('randomstring');
var fileUpload = require('express-fileupload');

var array = [];
var map = new HashMap();
var app = express();

app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());
//app.use(cookie);
var emailmessage1 = "Thank you for Registering with Expressionary.\nPlease enter this code to activate your account.\n     ";
var emailmessage2 = "\nExpressionary Welcomes you.\n";

var perror = "none";

var User = function (username,password,email,firstname,lastname,randomstring){
    this._username = username;
    this._password = password;
    this._email = email;
    this._firstname = firstname;
    this._lastname = lastname;
    this._randomstring = randomstring;
};

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

function userloggedincheck(req,cb) {
    if (req.cookies.user ==undefined){
        cb(false);
    }else {
        cb(true);
    }
}

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
   // Mail.sendEmail("expressionary307@gmail.com", emailmessage1 + emailmessage2)

});

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

app.get('/', function(req, res) {
    Connection.getUsers(function(topUsers){
        Connection.getWords(function(topWords) {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/index', {loggedin: loggedin, username : req.cookies.user, topUsers: topUsers, topWords: topWords, perror: perror});
            })
        //  res.render('pages/index', {topUsers: topUsers, topWords: topWords});
        })
    })
    //res.render('pages/index');
});

app.get('/search', function(req,res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/search', {loggedin: loggedin, username: req.cookies.user, perror: perror});
    })
});

app.post('/', function(req, res) {
    var email = req.body.email;
    Connection.addMailingList(email, function() {
        Mail.sendEmail(email, "You have subscribed to the Expressionary Newsletter");

        userloggedincheck(req,function(loggedin) {
            res.render('pages/index', {loggedin: loggedin, username : req.cookies.user, perror: perror});
        })
    });
    //add to mailing list table
});

app.get('/appendix', function(req,res) {
    Connection.getWordPages(function(wordPages) {
        Connection.getUsers(function(users){
            userloggedincheck(req,function(loggedin) {
                res.render('pages/wordlist', {loggedin: loggedin, username : req.cookies.user, wordPages : wordPages, users: users, perror: perror});
            })
        });
    });
});

app.post('/appendix', function(req,res) {
    console.log(req.body.word);
    console.log(req.body.user);
    var word = req.body.word;
    var username = req.body.user;
    if(username == undefined){
        Connection.getwpFromWord(word, function(wpid) {
            Connection.getPostsFromWordId(wpid, function(posts) {
                userloggedincheck(req,function(loggedin) {
                    res.render('pages/word', {loggedin: loggedin, username: req.cookies.user, word: word , posts: posts, perror: perror});
                })
            })
        })
    }else if(word == undefined){
        Connection.findUserByUsername(username, function(user){
            Connection.getPostsByUsername(username, function (posts) {
                userloggedincheck(req, function (loggedin) {
                    if (username == req.cookies.user){
                        var pull = "SELECT profile_img FROM users WHERE username = '" + user.username + "'";
                        con.query(pull, function(err, image){
                            res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                                username2: user.username, image:image, points: user.points, posts: posts, editcheck: true, perror: perror});
                        })
                    }else {
                        var pull = "SELECT profile_img FROM users WHERE username = '" + user.username + "'";
                        con.query(pull, function(err, image){
                            res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                                username2: user.username, image:image[0].profile_img, points: user.points, posts: posts, editcheck: true, perror: perror});
                        })
                    }
                })
            })
        })
    }


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

        console.log(points);
        console.log(post);
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }
    else if (!(req.body.vote1 === undefined)) {
        var i = 1;
        var vote = req.body.vote1;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote2 === undefined)) {
        var i = 2;
        var vote = req.body.vote2;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote3 === undefined)) {
        var i = 3;
        var vote = req.body.vote3;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                //console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, points, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Delete vote test");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else{//vote down
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, points, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                if(votes.direction == undefined){
                    Connection.subPointToPost(post, points, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes.direction == 0){//vote down
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else{//vote up
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, points, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote4 === undefined)) {
        var i = 4;
        var vote = req.body.vote4;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote5 === undefined)) {
        var i = 5;
        var vote = req.body.vote5;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote6 === undefined)) {
        var i = 6;
        var vote = req.body.vote6;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })

                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote7 === undefined)) {
        var i = 7;
        var vote = req.body.vote7;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote8 === undefined)) {
        var i = 8;
        var vote = req.body.vote8;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote9 === undefined)) {
        var i = 9;
        var vote = req.body.vote9;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else if (!(req.body.vote10 === undefined)) {
        var i = 10;
        var vote = req.body.vote10;
        var post = req.body.thePost[i];
        var points = req.body.points[i];
        if (vote == '+') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.addPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest++");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("Deletetest-+");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
        else if (vote == '-') {
            Connection.getVotes(post, req.cookies.user, function(votes){
                console.log(votes);
                if(votes[0] == undefined){
                    Connection.subPointToPost(post, req.cookies.user, function(result) {
                        if(result == "success"){
                            Connection.getPostsFromWordId(wpid, function(post) {
                                userloggedincheck(req,function(loggedin) {
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                });
                            });
                        }else{
                            console.log("failure to vote")
                        }
                    })
                }else if(votes[0].direction == 0){//vote down
                    console.log("DeleteTest--");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.getPostsFromWordId(wpid, function(post) {
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                            });
                        });
                    })
                }else if(votes[0].direction == 1){//vote up
                    console.log("Deletetest+-");
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post, perror: perror});
                                    });
                                });
                            }else{
                                console.log("failure to vote")
                            }
                        })
                    })
                }
            })
        }
    }else {
        console.log("hi");
    }
        })
    })
    }else {
        userloggedincheck(req,function(loggedin) {
            res.render("pages/registration",{loggedin: loggedin, username : req.cookies.user, perror: "Please Register or Log In"});
        });
    }
});

app.post('/word', function(req, res) {
    var definition = req.body.newDef;
    //console.log("ERROR!!");
    Connection.getwpFromWord(req.body.theWord, function(wpid) {
        if (req.cookies.user == undefined){
            console.log("user undefined");
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Please Register or Log In"});
            });
        }else {
            //console.log("posting");
            var user = req.cookies.user;
            Connection.getUserByUsername(user,function(result){

                if (result == "User Does not exist"){
                    console.error("SEVERE PROBLEM. SOMEONE IS TRYING TO HACK")
                }
                // handle apostrophe in definition
                var newDef = "";
                for(var i = 0; i < definition.length; i++){
                    if(definition[i] == '\'') {
                        newDef = newDef.concat('\\');
                    }
                    newDef = newDef.concat(definition[i]);
                }
                definition = newDef;

                con.query("INSERT INTO posts VALUE (NULL, NOW(), 0, 'text', '" + definition + "', "+ result +", " + wpid + ");", function(err, result) {
                if (err) throw err;
                else {
                    console.log("ERROR");
                    Connection.getPostsFromWordId(wpid, function (posts) {
                        userloggedincheck(req,function(loggedin) {
                            res.render('pages/word', {loggedin: loggedin, username : req.cookies.user, word: req.body.theWord, posts: posts, perror: perror});
                        });
                    })
                }})
            })
        }
    })
});

app.post('/search', function(req,res) {
    var term = req.body.search;
    var type = req.body.searchType;
    console.log(term);
    if (type == "Word") {
        console.log("WORD?"+term);

        //search database for words
        con.query("SELECT * FROM wordpage WHERE word = '" + term + "'", function(err, result) {
            if (err) throw err;

            if(result === undefined || result.length == 0 ){
                userloggedincheck(req,function(loggedin) {
                    //console.log("wordexist check");
                    res.render('pages/search', {loggedin: loggedin, username : req.cookies.user, perror: "Word does not exist"});
                })
            }else {
                var word = JSON.parse(JSON.stringify(result[0].word));
                Connection.getwpFromWord(term, function (wpid) {
                    if (wpid === undefined) {
                        console.log("wERROR");
                    }
                    else {
                        console.log(wpid);
                        Connection.getPostsFromWordId(wpid, function (posts) {
                            if (posts === undefined) {
                                console.log("pERROR");
                            }
                            else {
                                userloggedincheck(req, function (loggedin) {
                                    res.render('pages/word', {
                                        loggedin: loggedin,
                                        username: req.cookies.user,
                                        word: word,
                                        posts: posts,
                                        perror: perror
                                    });
                                })
                            }

                        })
                    }
                });
            }
        })
    }
    else if (type == "User") {
      //  console.log("ERROR!!");
        con.query("SELECT * FROM users WHERE username = '" + term + "'", function(err, result) {
            if (err) throw(err);
            if(result === undefined || result.length == 0 ) {
                userloggedincheck(req,function(loggedin) {
                    //console.log("wordexist check");
                    res.render('pages/search', {loggedin: loggedin, username : req.cookies.user, perror: "User does not exist"});
                })
            }else{
                var user = JSON.parse(JSON.stringify(result[0]));
                Connection.getPostsByUsername(user.username, function (posts) {
                    userloggedincheck(req, function (loggedin) {
                        if (user.username == req.cookies.user){
                            var pull = "SELECT profile_img FROM users WHERE username = '" + user.username + "'";
                            con.query(pull, function(err, image){
                                res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                                    username2: user.username, image:image[0].profile_img, points: user.points, posts: posts, editcheck: true, perror: perror});
                            })

                        }else {
                            var pull = "SELECT profile_img FROM users WHERE username = '" + user.username + "'";
                            con.query(pull, function(err, image){
                                res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                                    username2: user.username, image:image[0].profile_img, points: user.points, posts: posts, editcheck: true, perror: perror});
                            })
                        }
                    })
                })
            }
        })

    }
    else {
        userloggedincheck(req,function(loggedin) {
            res.render('pages/search', {loggedin: loggedin, username : req.cookies.user, perror: perror});
        });
    }
 //   console.log(term);
  //  console.log(type);

});

app.get('/contact', function(req, res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/contact', {loggedin: loggedin, username : req.cookies.user, perror: perror});
    });
});

app.get('/register', function(req, res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: perror});
    });
});

app.get('/useredit', function(req, res){
    userloggedincheck(req,function (loggedin) {
        if (loggedin == false){
            res.render('pages/suggest', {loggedin: loggedin, username : req.cookies.user, perror: "Please Register or Log In"});
            return;
        }else {
            Connection.findUserByUsername(req.cookies.user,function(user) {
                userloggedincheck(req,function(loggedin) {
                    res.render('pages/useredit', {loggedin: loggedin , username : req.cookies.user , usere: user, perror: perror});
                    //    res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "User Doesn't Exist"});
                });
            })
        }
    });

});

app.post('/useredit', function(req, res){
    var username = req.cookies.user;
    var newpass = req.body.pass;
    var oldpass = req.body.oldpass;
    var newfirst = req.body.fname;
    var newlast = req.body.lname;
    var newmail = req.body.email;
    Connection.updatePassword(username, oldpass, newpass, function(passError){
        Connection.updateFirstName(username, newfirst, function(fnameError){
            Connection.updateLastName(username, newlast, function(lnameError){
                Connection.updateEmail(username, newmail, function(emailError){
                    Connection.findUserByUsername(username, function(result){
                        Connection.getPostsByUsername(username, function(posts){
                            userloggedincheck(req,function(loggedin) {
                                var pull = "SELECT profile_img FROM users WHERE username = '" + username + "'";
                                con.query(pull, function(err, image){
                                    res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                                        username2: username, image:image, points: result.points, posts: posts, editcheck: true, perror: perror});
                                })
                            });
                        })
                    })
                })
            })
        })
    })
});

app.post('/imageUp.php', function (req, res){
   if(!req.files){
       return res.status(400).send('No files uploaded.');
   }
   //console.log(req.files);
   var file = req.files.usr_img;
   var img_name = file.name;
   //console.log("data:"+file.data);
   file.mv('public/images/profImage/'+img_name, function(err){

       if(err) return res.status(500).send(err);
       var sql = "UPDATE users SET profile_img = '" + img_name + "' WHERE username = '" + req.cookies.user + "'";
       var query = con.query(sql, function(err, result){
           //console.log(err);
           //console.log(result);
           var username = req.cookies.user;
           if (username == undefined){
               userloggedincheck(req,function(loggedin) {
                   res.render('pages/', {loggedin: loggedin, username : req.cookies.user, perror: perror});
               });
               return;
           }
           Connection.findUserByUsername(username, function(result){
               Connection.getPostsByUsername(username, function(posts){
                   userloggedincheck(req,function(loggedin) {
                       var pull = "SELECT profile_img FROM users WHERE username = '" + username + "'";
                       con.query(pull, function(err, image){
                           //console.log(image);
                           res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                               username2: username, image:img_name, points: result.points, posts: posts, editcheck: true, perror: perror});
                       })
                   });
               })
           })
       });
   });
});

app.get('/validate.php',function(req,res){
    if (map.get(req.query.uname) !=  undefined ){
        if (map.get(req.query.uname)._randomstring == req.query.valid){
            userloggedincheck(req,function(loggedin) {
                var username = req.query.uname;
                var reguname = map.get(username)._username;
                var password = map.get(username)._password;
                var email = map.get(username)._email;
                var firstname = map.get(username)._firstname;
                var lastname = map.get(username)._lastname;
                Connection.registerUser(email,reguname,password,firstname,lastname,function(result){
                    res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Successfully Registered"});
                    map.delete(username);
                    return;
                    });
                });
            }else {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Invalid Validation Code"})
            });
            }
    }else {
        userloggedincheck(req,function(loggedin) {
            res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Invaid Username"})
        });
        }
});

app.get('/action_page.php', function (req,res){

    if (map.get(req.query.uname) !=  undefined ){
        if (map.get(req.query.uname)._randomstring == req.query.psw){
     //       console.log("Step 2");
            userloggedincheck(req,function(loggedin) {
                var username = req.query.uname;
                var reguname = map.get(username)._username;
                var password = map.get(username)._password;
                var email = map.get(username)._email;
                var firstname = map.get(username)._firstname;
                var lastname = map.get(username)._lastname;
                Connection.registerUser(email,reguname,password,firstname,lastname,function(result){
                    res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Successfully Registered"});
                    map.delete(username);
                    return;
                });
            });
        }
    }

    Connection.getPassword(req.query.uname,function (result){
       // console.log(result.password)
        if (result == 'user not found' || result == 'user does not exist'){
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "User doesn't exist"});
            });

        }else if (req.cookies.user != undefined || array.indexOf(req.query.uname) != -1){
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "User Already Logged In"});
            });

        }else if (req.query.psw == result.password ) {
            array.push(req.query.uname);
            res.cookie('user', req.query.uname , {maxAge: 9000000});
            res.cookie('password', req.query.psw, {maxAge: 9000000});

            userloggedincheck(req,function(loggedin) {
                var user = req.query.uname;
                loggedin = true;
                res.render('pages/registration', {loggedin: loggedin, username : user, perror: "Login Successful"});
            });
        }
        else {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Invalid Credentials, Please try again"});
            });
        }
    });
});

app.post('/register', function (req,res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;


    if (email.length == 0){
        userloggedincheck(req,function(loggedin) {
            res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Please enter valid email"})
        });
        return;
    }else if (username.length==0){
        userloggedincheck(req,function(loggedin) {
            res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Username Cannot be empty"})
        });
    }else if (password.length == 0) {
        userloggedincheck(req, function (loggedin) {
            res.render('pages/registration', {
                loggedin: loggedin,
                username: req.cookies.user,
                perror: "Password Cannot be empty"
            })
        });
    }
    else {
        Connection.getUserByUsername(username,function(result){
            //console.log(result);
            if (result != "user does not exist"){
                userloggedincheck(req,function(loggedin) {
                    res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Username already exists, Please choose a different Username"})
                });
            }else {
                var random = randomstring.generate();
                var Person = new User(username,password,email,firstname,lastname, random);
                map.set(username,Person);
                Mail.sendEmail(email, emailmessage1 + random + emailmessage2);
                userloggedincheck(req,function(loggedin) {
                    res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Please validate your account before continuing"})
                });
            }
        });
    }
    return;

});

app.get('/user', function(req, res) {

    var username = req.cookies.user;

    if (username == undefined){
        userloggedincheck(req,function(loggedin) {
            res.render('pages/suggest', {loggedin: loggedin, username : req.cookies.user, perror: "Please Register or Log In"});
        });
    }else {
        Connection.findUserByUsername(username, function(result){
            Connection.getPostsByUsername(username, function(posts){
                userloggedincheck(req,function(loggedin) {
                    var pull = "SELECT profile_img FROM users WHERE username = '" + username + "'";
                    con.query(pull, function(err, image){
                        console.log(username);
                        console.log(image);
                        console.log(image[0].profile_img);
                        res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                            username2: username, image:image[0].profile_img, points: result.points, posts: posts, editcheck: true, perror: perror});
                    })
                });
            })
        })
    }
});

app.get('/random', function(req, res) {
    var userz = [];
	Connection.getWordPages(function(wordPages) {
	    var i = Math.floor(Math.random() * wordPages.length);
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
                            console.log(posts);
                            for (var i = 0; i < posts.length; i++) {
                                Connection.getUsernameByPost(posts[i], function(username) {
                                })
                            }
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user, word: word, posts: posts, perror: perror});
                            });
                        }
                    })
                }
            });
    })
});

app.get('/developer', function(req, res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/developer', {loggedin: loggedin, username : req.cookies.user, perror: perror});
    });
});

app.post('/contact', function(req, res) {
     var name = req.body.name;
     var email = req.body.email;
     var message = req.body.message;

     message = "NAME: " + name + "\nEMAIL: " + email + "\nMESSAGE: " + message;

     userloggedincheck(req,function(loggedin) {
        res.render('pages/index', {loggedin: loggedin, username : req.cookies.user, perror: perror});
     });
});

app.get('/logout',function (req,res) {

    Connection.getUsers(function(topUsers){
        Connection.getWords(function(topWords) {
            userloggedincheck(req,function(loggedin) { // only log the user out if he's logged in
                if (loggedin == true) {

                    var index = array.indexOf(req.cookies.user); // get the index of the user
                    array.splice(index,1); // delete 1 entry at index
                    res.cookie('user', '', {expires: new Date(0)}); // remove user from the cookie
                    res.cookie('password', '', {expires: new Date(0)}); // remove pass from the cookie

                    res.render('pages/index', {loggedin: false, username: "", topUsers: topUsers, topWords: topWords, perror: perror});
                }else {
                    res.render('pages/index', {loggedin: loggedin, username: req.cookies.user, topUsers: topUsers, topWords: topWords, perror: perror});
                }
            })
        });
    });
});

app.get('/deleteUser.php', function(req,res){
   var username = req.cookies.user;
    userloggedincheck(req,function(loggedin) {
        if (loggedin == false){
            res.render('pages/developer', {loggedin: loggedin, username : req.cookies.user, perror: "Please Register or Log In"});
        }else {
            Connection.deleteUser(username,function(result){
                if (result == "deletion successful"){
                    var index = array.indexOf(req.cookies.user); // get the index of the user
                    array.splice(index,1); // delete 1 entry at index
                    res.cookie('user', '', {expires: new Date(0)}); // remove user from the cookie
                    res.cookie('password', '', {expires: new Date(0)}); // remove pass from the cookie
                    res.render('pages/developer', {loggedin: loggedin, username: req.cookies.user, perror: "Deletion Successful"});
                }else {
                    res.render('pages/developer', {loggedin: loggedin, username: req.cookies.user, perror: "Deletion Failed"});
                }
            });
        }
    });
});

app.get('/validate.php',function(req,res){

    if (map.get(req.query.uname) !=  undefined ){
        if (map.get(req.query.uname)._randomstring == req.query.valid){
            userloggedincheck(req,function(loggedin) {
                var username = req.query.uname;
                var reguname = map.get(username)._username;
                var password = map.get(username)._password;
                var email = map.get(username)._email;
                var firstname = map.get(username)._firstname;
                var lastname = map.get(username)._lastname;

                Connection.registerUser(email,username,password,firstname,lastname,function(result){
                    if (result != "success"){
                        userloggedincheck(req,function(loggedin) {
                            res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Username already exists, Please choose a different Username"});
                        });
                    }else {
                        res.render('pages/registration', {
                            loggedin: loggedin,
                            username: req.cookies.user,
                            perror: "Successfully Registered"
                        });
                        map.delete(username);
                    }
                });
            });
        }else {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Invalid Validation Code"})
            });
        }
    }else {
        userloggedincheck(req,function(loggedin) {
            res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, perror: "Invaid Username"})
        });
    }
});

app.post('/user',function (req,res){

    var username = req.body.user;

    if (username == undefined){
        return;
    }
    Connection.findUserByUsername(username, function(result){
        Connection.getPostsByUsername(username, function(posts){
            userloggedincheck(req,function(loggedin) {
                if (username == req.cookies.user){
                    var pull = "SELECT profile_img FROM users WHERE username = '" + username + "'";
                    con.query(pull, function(err, image){
                        res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                            username2: username, image:image[0].profile_img, points: result.points, posts: posts, editcheck: true, perror: perror});
                    })
                }else {
                    var pull = "SELECT profile_img FROM users WHERE username = '" + username + "'";
                    con.query(pull, function(err, image){
                        res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                            username2: username, image:image[0].profile_img, points: result.points, posts: posts, editcheck: false, perror: perror});
                    })
                }
            });
        })
    })
});

app.post('/w1',function (req,res){
    var word = req.body.word;
    Connection.getwpFromWord(word, function(wpid) {
        Connection.getPostsFromWordId(wpid, function(posts) {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/word', {loggedin: loggedin, username: req.cookies.user, word: word , posts: posts, perror: perror});
            })
        })
    })
});

app.get('/suggest',function (req,res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/suggest', {loggedin: loggedin, username : req.cookies.user, perror: perror});
    })
});

app.post('/wsuggest',function(req,res){
    res.send(req.body.suggested);
});
app.post('/isuggest',function(req,res){
    if(!req.files){
        return res.status(400).send('No files uploaded.');
    }
    //console.log(req.files);
    var file = req.files.sug_img;
    var img_name = file.name;
    //console.log("data:"+file.data);
    file.mv('public/images/sugimage/'+img_name, function(err){
        if(err) return res.status(500).send(err);

});

app.get('/sub',function(req,res){
    Connection.subscribeUser(req.cookies.user, function(perror){
        userloggedincheck(req,function(loggedin) {
            console.log(req.cookies.user + ": subscribed");
            res.render('pages/suggest', {loggedin: loggedin, username : req.cookies.user, perror: perror});
        })
    })
});

app.get('/unsub',function(req,res){
    Connection.unsubscribeUser(req.cookies.user, function(perror){
        userloggedincheck(req,function(loggedin) {
            console.log(req.cookies.user + ": unsubscribed");
            res.render('pages/suggest', {loggedin: loggedin, username : req.cookies.user, perror: perror});
        })
    })
});

app.listen(8080);
console.log('8080 is the magic port');

