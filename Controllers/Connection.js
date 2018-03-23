var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "expressionary_data"
});
con.connect(function(err) {
    if (err) throw err;
    else {
        console.log("Connected!");
    }

});


//if one field does not exist whole query returns null
exports.getwpFromWord = getwpFromWord;
function getwpFromWord(word, cb) {
    con.query("SELECT wp_id FROM wordpage WHERE word = '" + word + "'", function(err, result) {
        //var z = JSON.parse(z);
        //console.log("WORD: " + word);
        //console.log("RESULT: " + result);
        if (err) cb("fail1");
        else {
            var z = JSON.parse(JSON.stringify(result[0]));

            cb(z.wp_id);
        }

    })
    // /*var request = "SELECT posts.date, posts.definition, posts.points, user.username, wordpage.totalPoints FROM wordpage, posts, users WHERE wordpage.word = " + word + "," +
    //     "posts.wordpage_wp_id = wordpage.wp_id, users.user_id = posts.users_user_id";
    // var wordPageData = [];
    // var wordId = 0;
    // con.query(request, function(err, result) {
    //     if(err) return "notFound";
    //     for(var i in result) {
    //         wordPageData.push(i);
    //     }
    //     console.log(result);
    // });*/
    // //var wordPageData = [];
    // con.connect(function (err) {
    //     if (err) throw err;
    //
    //
    // var requestWord = "SELECT word FROM wordpage WHERE word = '" + word + "'";
    // //console.log(requestWord);
    // con.query(requestWord, function(err, result) {
    //     if(err) return "notFound";
    //     //for(var i in result) {
    //     //    wordPageData.push(i);
    //     //}
    //     //format: [RowDataPacket { wp_id: int, totalPoints: int}]
    //     return(result);
    // });
    // });

}
exports.getPostsFromWordId = getPostsFromWordId;
function getPostsFromWordId(wp_id, cb) {
    //var request = "SELECT posts.date, posts.points, posts.definition, users.username FROM posts, users WHERE posts. wordPage_wp_id = " + wp_id + "&& posts.users_user_id = users.user_id";
    var request = "SELECT * FROM posts WHERE wordpage_wp_id = " + wp_id + "";
    con.query(request, function(err, result) {
        if(err) cb("fail1");
        else {
            //format: [RowDataPacket { date: datetime variable, points: 0, definition: text, username: text}]

            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}
exports.getWordPages = getWordPages;
function getWordPages(cb) {
    con.query("SELECT word FROM wordpage", function(err, result) {
        if (err) cb("fail1");
        else {
            var z = JSON.parse(JSON.stringify(result));
            //console.log(z);
            cb(z);
        }
    });
}
exports.getUsernameByPost = getUsernameByPost;
function getUsernameByPost(post, cb) {
    userById(post.users_user_id, function(username) {
        cb(username);
    })
}
exports.registerUser = registerUser;
//maybe need cb

function registerUser(email, username, password, firstName, lastName, cb) {

    //firstName, LastName can = "NULL" [optional]
    var request = "INSERT INTO users VALUE(NULL, 0, '" + email + "', '" + username +"', '"+password+"', '"+ firstName+ "', '"+lastName+"')";
    //console.log(request);
    con.query(request, function(err, result) {

        if(err) {
            cb("failure registering user")
        }else {

            cb(result);
        }
    });
}
exports.addWord = addWord;
function addWord(word, cb) {
    var request = "INSERT INTO wordpage VALUES(NULL, '" + word + "', '" + 0 + "'";
    con.query(request, function(err, result) {
        if(err) cb("fail1");
        else {
            cb("success");
        }
    })
}
function findUserByEmail(email) {

}

function userById(id, cb) {
    con.query("SELECT username FROM users WHERE user_id = " + id + "", function(err, result) {
        if (err) cb("fail1")
        else {
            var z = JSON.parse(JSON.stringify(result[0].username));
            console.log("USERNAME: " + z);
            cb(z);
        }
    })
}

//user for getting information for user page as well
exports.findUserByUsername = findUserByUsername;
function findUserByUsername(username, cb) {
    con.query("SELECT * FROM users WHERE username = '" + username + "'", function(err, result) {
        if (err) cb("fail1");
        else {
            var z = JSON.parse(JSON.stringify(result[0]));
            cb(z);
        }
    })
}

//get user contributions for profile page
exports.getPostsByUsername = getPostsByUsername;
function getPostsByUsername(username, cb) {
    con.query("SELECT user_id FROM users WHERE username = '" + username +"'", function(err, uid) {
        if(err) {
            cb("error finding this user");
        } else if(uid.length == 0) {
            cb("user does not exist");
        } else {
            con.query("SELECT * FROM posts WHERE users_user_id = " + uid, function(err, result) {
                if(err) {
                    cb("error in finding posts associated with this user");
                } else if(result.length == 0) {
                    cb("this user has no contributions yet");
                } else {
                    var z = JSON.parse(JSON.stringify(result));
                    cb(z);
                }
            });
        }
    });
}

exports.addMailingList = addMailingList;
function addMailingList(email, cb) {
    con.query("INSERT INTO mailinglist VALUES('" + email + "')", function(err, result) {
        if (err) cb("failure");
        else {
            console.log("SUCCESS");
            cb("success");
        }
    })
}
exports.addPointToPost = addPointToPost;
function addPointToPost(definition, points, cb) {
    var pt = parseInt(points) + 1;
    con.query("UPDATE posts SET points = '" + pt + "' WHERE definition = '" + definition + "'", function(err, result) {
        if (err) throw err;
        cb("success");
    })
}
exports.subPointToPost = subPointToPost;
function subPointToPost(definition, points, cb) {
    var pt = parseInt(points) - 1;
    con.query("UPDATE posts SET points = '" + pt + "' WHERE definition = '" + definition + "'", function(err, result) {
        if (err) throw err;
        cb("success");
    })
}

exports.getPassword = getPassword;
function getPassword(username,cb) {
    console.log(username)
    con.query("SELECT password FROM users WHERE username = '" + username + "'", function(err, result) {
        //console.log(result);
        if(err) cb("user not found");
        else{
            if(result.length == 0) {
                cb("user does not exist");
            }
            else {
                var z = JSON.parse(JSON.stringify(result[0]));
                cb(z);
            }
        }
    });
}

//delete for users
exports.deleteUser = deleteUser;
function deleteUser(username, cb) {
    con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function(err, uid) {
        console.log(uid[0]);
        if(uid.length == 0) {cb("user does not exist");}
        else {
            con.query("DELETE FROM posts WHERE users_user_id = " + uid[0].user_id, function(err, result) {
                console.log(err);
                if(err) cb("error deleting posts associated with this user");
                /*else  {
                    cb("deletion successful");
                }*/
            });
            con.query("DELETE FROM users WHERE username = '" + username + "'", function(err, result) {
                console.log(err);
                if(err) cb("error deleting user");
                else {
                    //var z = JSON.parse(JSON.stringify(result[0]));
                    //cb(z);
                    //delete all posts created by the user who is being deleted
                    cb("deletion successful");
                }
            });
        }
    });
}
//delete for posts
exports.deletePost = deletePost;
function deletePost(pid, cb) {
    con.query("DELETE FROM posts WHERE post_id = "+ pid, function(err, result) {
        if(err) cb("error deleting post");
        else {
            var z = JSON.parse(JSON.stringify(result[0]));
            cb(z);
        }
    });
}
//delete for wp
exports.deleteWord = deleteWord;
function deleteWord() {

}