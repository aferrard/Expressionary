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

});

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

app.get('/', function(req, res) {
    Connection.getUsers(function(topUsers){
        Connection.getWords(function(topWords) {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/index', {loggedin: loggedin, username : req.cookies.user,topUsers: topUsers, topWords: topWords});
            })
        //  res.render('pages/index', {topUsers: topUsers, topWords: topWords});
        })
    })
    //res.render('pages/index');
});


app.get('/search', function(req,res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/search', {loggedin: loggedin, username : req.cookies.user});
    })
});

app.post('/', function(req, res) {
    var email = req.body.email;
    Connection.addMailingList(email, function() {
        Mail.sendEmail(email, "You have subscribed to the Expressionary Newsletter");

        userloggedincheck(req,function(loggedin) {
            res.render('pages/index', {loggedin: loggedin, username : req.cookies.user});
        })
    });
    //add to mailing list table
});

app.get('/wordlist', function(req,res) {
    Connection.getWordPages(function(wordPages) {
        userloggedincheck(req,function(loggedin) {
            res.render('pages/wordlist', {loggedin: loggedin, username : req.cookies.user, wordPages : wordPages});
        })
    })
});

app.post('/wordlist', function(req,res) {
    var word = req.body.word;
    Connection.getwpFromWord(word, function(wpid) {
        Connection.getPostsFromWordId(wpid, function(posts) {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: word , posts: posts});
            })
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
                            });
                        });
                    })
                }else{//vote down
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.addPointToPost(post, points, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
                            });
                        });
                    })
                }else{//vote up
                    Connection.deleteVote(post, req.cookies.user, function(){
                        Connection.subPointToPost(post, points, req.cookies.user, function(result) {
                            if(result == "success"){
                                Connection.getPostsFromWordId(wpid, function(post) {
                                    userloggedincheck(req,function(loggedin) {
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                    res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
                                        res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: req.body.theWord, posts: post});
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
            res.render("pages/registration",{loggedin: loggedin, username : req.cookies.user, regError: "Please Register or Log In"});
        });
    }
});

app.post('/word', function(req, res) {
    var definition = req.body.newDef;
    console.log("ERROR!!");
    Connection.getwpFromWord(req.body.theWord, function(wpid) {
        if (req.cookies.user == undefined){
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "Please Register or Log In"});
            });
        }else {
            var user = req.cookies.user;
            Connection.getUserByUsername(user,function(result){

                if (result == "User Does not exist"){
                    console.error("SEVERE PROBLEM. SOMEONE IS TRYING TO HACK")
                }
                con.query("INSERT INTO posts VALUE (NULL, NOW(), 0, '" + definition + "', "+ result +", " + wpid + ");", function(err, result) {
                if (err) throw err;
                else {
                    console.log("ERROR");
                    Connection.getPostsFromWordId(wpid, function (posts) {
                        userloggedincheck(req,function(loggedin) {
                            res.render('pages/word', {loggedin: loggedin, username : req.cookies.user, word: req.body.theWord, posts: posts});
                        });
                      })
                }})
            })
        }
    })
});

app.post('/search', function(req,res) {
    console.log("1- ERROR!!");
    var term = req.body.search;
    var type = req.body.searchType;
    if (type == "Word") {
        //search database for words
        con.query("SELECT * FROM wordpage WHERE word = '" + term + "'", function(err, result) {
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
                            // console.log(posts);
                            // for (var i = 0; i < posts.length; i++) {
                            //     Connection.getUsernameByPost(posts[i], function(username) {
                            //         //console.log("USERNAME AGAIN: " + username);
                            //         //userz[i] = username;
                            //         //console.log(userz[0]);
                            //         // posts[i].username = "barryuser";
                            //     })
                            // }
                            userloggedincheck(req,function(loggedin) {
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user,word: word, posts: posts});
                            })
                        }

                    })
                }
            });
        })
    }
    else if (type == "User") {
      //  console.log("ERROR!!");
        Connection.findUserByUsername(term, function(user) {

            Connection.getPostsByUsername(user.username, function (posts) {
                userloggedincheck(req, function (loggedin) {
                    if (user.username == req.cookies.user){
                       // console.log("Let him edit");
                        var temp = true;
                        res.render('pages/user', {loggedin: loggedin, username : req.cookies.user, username2: user.username,
                            points: user.points, posts: posts, editcheck:temp});
                    }else {
                        var temp = false;
                        res.render('pages/user', {loggedin: loggedin, username : req.cookies.user, username2: user.username,
                            points: user.points, posts: posts, editcheck:temp});
                    }
                })
            })
        })
    }
    else {
        userloggedincheck(req,function(loggedin) {
            res.render('pages/search', {loggedin: loggedin, username : req.cookies.user});
        });
    }
 //   console.log(term);
  //  console.log(type);

});

// about page 
app.get('/contact', function(req, res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/contact', {loggedin: loggedin, username : req.cookies.user});
    });
});

app.get('/register', function(req, res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user,regError: ""});
    });
});

app.get('/useredit', function(req, res){
    Connection.findUserByUsername(req.cookies.user,function(user) {
        userloggedincheck(req,function(loggedin) {
            res.render('pages/useredit', {loggedin: loggedin , username : req.cookies.user , usere: user});
        //    res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "User Doesn't Exist"});
        });
    })
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
                                if (username == req.cookies.user){
                                    var temp = true;
                                    console.log("Let him edit");
                                    res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                                        username2: username, points: result.points, posts: posts, editcheck: temp});
                                }else {
                                    var temp = false;
                                    res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                                        username2: username, points: result.points, posts: posts, editcheck: temp});
                                }
                            });
                        })
                    })
                })
            })
        })
    })

});
app.get('/action_page.php', function (req,res){
    Connection.getPassword(req.query.uname,function (result){
       // console.log(result.password)
        if (result == 'user not found' || result == 'user does not exist'){
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "User Doesn't Exist"});
            });

        }else if (req.cookies.user != undefined || array.indexOf(req.query.uname) != -1){
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "User Already Logged In"});
            });

        }else if (req.query.psw == result.password ) {
            array.push(req.query.uname);
            res.cookie('user', req.query.uname , {maxAge: 180000});
            res.cookie('password', req.query.psw, {maxAge: 180000});

            userloggedincheck(req,function(loggedin) {
                var user = req.query.uname;
                loggedin = true;
                res.render('pages/registration', {loggedin: loggedin, username : user, regError: "Login Successful"});
            });
        }
        else {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "Invalid Credentials, Please try again"});
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


    Connection.registerUser(email,username,password,firstname,lastname,function (result){
        if (result=="failure registering user"){
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "Username already exists.Please try again"});
            });
        }

        else if (result=="username field cannot be empty") {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "username field cannot be empty"});
            });
        }

        else if (result=="username is too long") {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user, regError: "username is too long"});
            });

        } else {
            userloggedincheck(req,function(loggedin) {
                res.render('pages/registration', {loggedin: loggedin, username : req.cookies.user,regError: "Successfully registered user"});
            })
        }


    })
});

app.get('/user', function(req, res) {
    var username = req.cookies.user;
    Connection.findUserByUsername(username, function(result){
        Connection.getPostsByUsername(username, function(posts){
            userloggedincheck(req,function(loggedin) {
                if (username == req.cookies.user){
                    var temp = true;
                    console.log("Let him edit");
                    res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                        username2: username, points: result.points, posts: posts, editcheck: temp});
                }else {
                    var temp = false;
                    res.render('pages/user', {loggedin: loggedin, username : req.cookies.user,
                        username2: username, points: result.points, posts: posts, editcheck: temp});
                }
            });
        })
    })
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
                                res.render('pages/word', {loggedin: loggedin, username : req.cookies.user, word: word, posts: posts});
                            });
                        }
                    })
                }
            });
    })
});

app.get('/developer', function(req, res) {
    userloggedincheck(req,function(loggedin) {
        res.render('pages/developer', {loggedin: loggedin, username : req.cookies.user});
    });
});


app.post('/contact', function(req, res) {
     var name = req.body.name;
     var email = req.body.email;
     var message = req.body.message;

     message = "NAME: " + name + "\nEMAIL: " + email + "\nMESSAGE: " + message;
     Mail.sendEmail("expressionaryproject@gmail.com", message);
     //console.log(name + email + message);

     userloggedincheck(req,function(loggedin) {
        res.render('pages/index', {loggedin: loggedin, username : req.cookies.user});
     });
});

app.listen(8080);
console.log('8080 is the magic port');

