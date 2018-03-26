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
    var request = "SELECT posts.*, users.username FROM posts, users WHERE posts.wordpage_wp_id = " + wp_id + " && posts.users_user_id = users.user_id";
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
    var execute = true;
    //firstName, LastName can = "NULL" [optional]
    //check username
    if(username.length == 0) {
        cb("username field cannot be empty");
        execute = false;
    } else if(username.length > 45) {
        cb("username is too long");
        execute = false;
    }

    //check password
    if(password.length == 0) {
        cb("password field cannot be empty");
        execute = false;
    } else if(password.length > 45) {
        cb("password is too long");
        execute = false;
    }
    if(execute){
        var request = "INSERT INTO users VALUE(NULL, 0, '" + email + "', '" + username + "', '" + password + "', '" + firstName + "', '" + lastName + "')";
        //console.log(request);
        con.query(request, function (err, result) {

            if (err) {
                cb("failure registering user")
            } else {

                cb(result);
            }
        });
    }
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

exports.getUsers = getUsers;
function getUsers(cb) {
    con.query("SELECT * FROM users", function(err, result) {
        if(err) {
            cb(err);
        } else {
            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}

exports.getWords = getWords;
function getWords(cb) {
    con.query("SELECT * FROM wordpage", function(err, result) {
        if(err) {
            cb(err);
        } else {
            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}

exports.getUserByUsername = getUserByUsername;
function getUserByUsername(username, cb) {
    con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function(err, result) {
        if(err) {
            cb(err);
        } else if(result.length == 0) {
            cb("user does not exist");
        } else {
            var z = JSON.parse(JSON.stringify(result[0].user_id));
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
            //console.log(uid);
            con.query("SELECT posts.*, wordpage.word FROM posts, wordpage WHERE posts.users_user_id = "+uid[0].user_id+" && posts.wordpage_wp_id = wordpage.wp_id", function(err, result) {
                if(err) {
                    //cb("error in finding posts associated with this user");
                    cb(err);
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
        if (err) throw err; else {
            con.query("SELECT post_id, users_user_id, wordpage_wp_id FROM posts WHERE definition = '" + definition + "'", function(err, postinfo) {
                if(err) {
                    cb(err);
                } else {
                    if(postinfo.length == 0) {
                        cb("this post does not exist");
                    } else {
                        con.query("INSERT INTO posts_voted VALUE(" + postinfo[0].post_id + ", " + postinfo[0].users_user_id +", 1)", function(err, result) {
                            if(err) {
                                cb(err);
                            }
                        });
                        con.query("SELECT points FROM users WHERE user_id = " + postinfo[0].users_user_id, function(err, result) {
                            if(err) {
                                cb(err);
                            } else {
                                con.query("UPDATE users SET points = " + (result[0].points + 1) + " WHERE user_id = " + postinfo[0].users_user_id, function(err, result) {
                                    if(err) {
                                        cb(err);
                                    }
                                });
                                con.query("SELECT totalPoints FROM wordpage WHERE wp_id = " + postinfo[0].wordpage_wp_id, function(err, totalpoints) {
                                    if(err) {
                                        cb(err);
                                    } else {
                                        con.query("UPDATE wordpage SET totalPoints = " + (totalpoints[0].totalPoints + 1)+ " WHERE wp_id = " + postinfo[0].wordpage_wp_id, function(err, result) {
                                            if(err) {
                                                cb(err);
                                            } else {
                                                cb("reached all queries: add");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
            //cb("success");
        }
    })
}
exports.subPointToPost = subPointToPost;
function subPointToPost(definition, points, cb) {
    var pt = parseInt(points) - 1;
    con.query("UPDATE posts SET points = '" + pt + "' WHERE definition = '" + definition + "'", function(err, result) {
        if (err) throw err; else {
            con.query("SELECT post_id, users_user_id, wordpage_wp_id FROM posts WHERE definition = '" + definition + "'", function(err, postinfo) {
                if(err) {
                    cb(err);
                } else {
                    if(postinfo.length == 0) {
                        cb("this post does not exist");
                    } else {
                        con.query("INSERT INTO posts_voted VALUE(" + postinfo[0].post_id + ", " + postinfo[0].users_user_id +", 0)", function(err, result) {
                            if(err) {
                                cb(err);
                            }
                        });
                        con.query("SELECT points FROM users WHERE user_id = " + postinfo[0].users_user_id, function(err, result) {
                            if(err) {
                                cb(err);
                            } else {
                                con.query("UPDATE users SET points = " + (result[0].points - 1) + " WHERE user_id = " + postinfo[0].users_user_id, function(err, result) {
                                    if(err) {
                                        cb(err);
                                    }
                                });
                                con.query("SELECT totalPoints FROM wordpage WHERE wp_id = " + postinfo[0].wordpage_wp_id, function(err, totalpoints) {
                                    if(err) {
                                        cb(err);
                                    } else {
                                        con.query("UPDATE wordpage SET totalPoints = " + (totalpoints[0].totalPoints - 1)+ " WHERE wp_id = " + postinfo[0].wordpage_wp_id, function(err, result) {
                                            if(err) {
                                                cb(err);
                                            } else {
                                                cb("reached all queries: sub");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
            //cb("success");
        }
    })
}

exports.deleteVote = deleteVote;
function deleteVote(postid, userid, cb) {
    con.query("DELETE FROM posts_voted WHERE posts_post_id = " + postid + " && posts_users_user_id = " + userid + "'", function(err, result) {
        if(err) {
            cb(err);
        } else {
            cb("deleted");
        }
    });
}

exports.getVotes = getVotes;
function getVotes(postid, userid, cb) {
    con.query("SELECT * FROM posts_voted WHERE posts_post_id = " + postid + " && posts_users_user-id = " + userid, function(err, result) {
        if(err) {
            cb(err);
        } else {
            var z = JSON.parse(JSON.stringify(result));
        }
    });
}

exports.getPassword = getPassword;
function getPassword(username,cb) {
//    console.log(username)
    if(username.length == 0) {
        cb("username field cannot be empty");
    } else if(username.length > 45) {
        cb("username is too long");
    } else {
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
}



//delete for users
exports.deleteUser = deleteUser;
function deleteUser(username, cb) {
    con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function(err, uid) {
       // console.log(uid[0]);
        if(uid.length == 0) {cb("user does not exist");}
        else {
            con.query("DELETE FROM posts WHERE users_user_id = " + uid[0].user_id, function(err, result) {
              //  console.log(err);
                if(err) cb("error deleting posts associated with this user");
                /*else  {
                    cb("deletion successful");
                }*/
            });
            con.query("DELETE FROM users WHERE username = '" + username + "'", function(err, result) {
            //    console.log(err);
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


//update user info functions
exports.updateUsername = updateUsername;
function updateUsername(oldUsername, newUsername,  cb) {
    if(newUsername.length == 0) {
        cb("new username invalid: cannot have length 0");
    } else if(newUsername.length > 45) {
        cb("new username invalid: too long");
    } else {
        con.query("SELECT user_id FROM users WHERE username = '" + oldUsername + "'", function (err, result) {
            if (err) {
                cb(err);
            } else {
                if (result.length == 0) {
                    cb("old username not valid"); // should never occur
                } else {
                    userid = result[0].user_id;
                    //console.log(userid);
                    con.query("UPDATE users SET username = '" + newUsername + "' WHERE user_id = " + userid, function (err, result) {
                        //console.log(result);
                        if (result.affectedRows == 1) {
                            cb("update successful: username");
                        } else if(result.affectedRows == 0){
                            cb("update failed: username");
                        } else {
                            cb("catastrophic internal corruption: username");
                        }
                    });
                }
            }
        });
    }
}

exports.updatePassword = updatePassword;
function updatePassword(username, oldPassword, newPassword, cb) {
    //will be modified later to validate old password first
    con.query("SELECT password FROM users WHERE username = '" + username + "'", function(err, oldPasswordreturn) {
        console.log(oldPasswordreturn);
        if(err) {
            cb(err);
        } else if(oldPasswordreturn[0].password != oldPassword){
            cb("old password is incorrect");
        } else if(oldPasswordreturn[0].password == oldPassword) {
            if(newPassword.length == 0) {
                cb("new password invalid: cannot have length 0");
            } else if(newPassword.length > 45) {
                cb("new password invalid: too long");
            } else {
                con.query("UPDATE users SET password = '" + newPassword + "' WHERE username = '" + username + "'", function(err, result) {
                    if(err) {
                        cb(err);
                    } else {
                        if (result.affectedRows == 1) {
                            cb("update successful: password");
                        } else if(result.affectedRows == 0) {
                            cb("update failed: password");
                        } else {
                            cb("catastrophic internal corruption: password");
                        }
                    }
                });
            }
        }
    });

}

exports.updateEmail = updateEmail;
function updateEmail(username, newEmail, cb) {
    if(newEmail.includes("@")) {
        con.query("UPDATE users SET email = '" + newEmail + "' WHERE username = '" + username + "'", function(err, result) {
            if(err) {
                cb(err);
            } else {
                if(result.affectedRows == 1) {
                    cb("update successful: email");
                } else if(result.affectedRows == 0){
                    cb("update failed: email");
                } else {
                    cb("catastrophic internal corruption: email");
                }
            }
        });
    } else {
        cb("new email invalid");
    }
}

exports.updateFirstName = updateFirstName;
function updateFirstName(username, newFirstName, cb) {
    if(newFirstName.length > 45) {
        cb("invalid first name: too long.");
    } else {
        con.query("UPDATE users SET first_name = '" + newFirstName + "' WHERE username = '" + username + "'", function(err, result){
            if(err) {
                cb(err);
            } else {
                if(result.affectedRows == 1) {
                    cb("update successful: first name");
                } else if(result.affectedRows == 0) {
                    cb("update failed: first name");
                } else {
                    cb("catastrophic internal corruption: first name");
                }
            }

        });
    }
}

exports.updateLastName = updateLastName;
function updateLastName(username, newLastName, cb) {
    if(newLastName.length > 45) {
        cb("invalid last name: too long.");
    } else {
        con.query("UPDATE users SET last_name = '" + newLastName + "' WHERE username = '" + username + "'", function(err, result){
            if(err) {
                cb(err);
            } else {
                if(result.affectedRows == 1) {
                    cb("update successful: last name");
                } else if(result.affectedRows == 0) {
                    cb("update failed: last name");
                } else {
                    cb("catastrophic internal corruption: last name");
                }
            }

        });
    }
}
