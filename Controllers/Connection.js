var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "expressionary_data"
});

con.connect(function (err) {
    if (err) throw err;
    else {
        console.log("Connected!");
    }

});


//if one field does not exist whole query returns null
exports.getwpFromWord = getwpFromWord;

function getwpFromWord(word, cb) {
    con.query("SELECT wp_id FROM wordpage WHERE word = '" + word + "'", function (err, result) {
        //var z = JSON.parse(z);
        //console.log("WORD: " + word);
        //console.log("RESULT: " + result);
        if (err) cb("fail1");
        else {
            var z = JSON.parse(JSON.stringify(result[0]));

            cb(z.wp_id);
        }

    });
}

exports.getPostsFromWordId = getPostsFromWordId;

function getPostsFromWordId(wp_id, cb) {
    //var request = "SELECT posts.date, posts.points, posts.definition, users.username FROM posts, users WHERE posts. wordPage_wp_id = " + wp_id + "&& posts.users_user_id = users.user_id";
    var request = "SELECT posts.*, users.username, users.points AS userpoints, users.profile_img FROM posts, users WHERE posts.wordpage_wp_id = " + wp_id + " && posts.users_user_id = users.user_id";
    con.query(request, function (err, result) {
        if (err) cb("fail1");
        else {
            //format: [RowDataPacket { date: datetime variable, points: 0, definition: text, username: text}]

            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}

exports.getWordPages = getWordPages;

function getWordPages(cb) {
    con.query("SELECT word, content_type FROM wordpage", function (err, result) {
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
    userById(post.users_user_id, function (username) {
        cb(username);
    })
}

exports.registerUser = registerUser;

function registerUser(email, username, password, firstName, lastName, cb) {
    var execute = true;
    //firstName, LastName can = "NULL" [optional]
    //check username
    if (username.length == 0) {
        cb("username field cannot be empty");
        execute = false;
    } else if (username.length > 45) {
        cb("username is too long");
        execute = false;
    }

    //check password
    if (password.length == 0) {
        cb("password field cannot be empty");
        execute = false;
    } else if (password.length > 45) {
        cb("password is too long");
        execute = false;
    }


    if (execute) {
        /*var image;
        var fs = require('fs');
        fs.readFile("/home/ayush/Desktop/gender-neutral-user.png", function(err, result) {
            if(err) throw err;
            else{
                //console.log(result);
                fs.writeFile("/home/ayush/Desktop/output.txt", result, function(err) {
                    if(err)throw(err);
                    else{
                        image = result
                    }
                });
            }
        });*/
        con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, user) {
            if (err) {
                cb(err);
            } else {
                if (user.length != 0) {
                    cb("failure registering user");
                }
                else {
                    var request = "INSERT INTO users VALUE(NULL, 0, '" + email + "', '" + username + "', '" + password + "', 'default.png', '" + firstName + "', '" + lastName + "', 0, 0)";
                    //console.log(request);
                    con.query(request, function (err, result) {

                        if (err) {
                            cb("failure registering user")
                        } else {
                            // console.log(result)
                            cb(result);
                        }
                    });
                }
            }
        });
    }
}

exports.addWord = addWord;

function addWord(content_type, word, cb) {
    var request = "INSERT INTO wordpage VALUES(NULL, '" + content_type + "', '" + word + "', '" + 0 + "'";
    con.query(request, function (err, result) {
        if (err) cb("fail1");
        else {
            cb("success");
        }
    })
}

function findUserByEmail(email) {

}

exports.userById = userById;

function userById(id, cb) {
    con.query("SELECT username FROM users WHERE user_id = " + id + "", function (err, result) {
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
    con.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result) {
        if (err) cb("fail1");
        else {
            var z = JSON.parse(JSON.stringify(result[0]));
            cb(z);
        }
    })
}

exports.getUsers = getUsers;

function getUsers(cb) {
    con.query("SELECT * FROM users", function (err, result) {
        if (err) {
            cb(err);
        } else {
            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}

exports.getWords = getWords;

function getWords(cb) {
    con.query("SELECT * FROM wordpage", function (err, result) {
        if (err) {
            cb(err);
        } else {
            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}

exports.getUserByUsername = getUserByUsername;

function getUserByUsername(username, cb) {
    con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, result) {
        if (err) {
            //cb(err);
            cb("error");
        } else if (result.length == 0) {
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
    con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, uid) {
        if (err) {
            cb("error finding this user");
        } else if (uid.length == 0) {
            cb("user does not exist");
        } else {
            //console.log(uid);
            con.query("SELECT posts.*, wordpage.word FROM posts, wordpage WHERE posts.users_user_id = " + uid[0].user_id + " && posts.wordpage_wp_id = wordpage.wp_id", function (err, result) {
                if (err) {
                    //cb("error in finding posts associated with this user");
                    cb(err);
                } else if (result.length == 0) {
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
    con.query("INSERT INTO mailinglist VALUES('" + email + "')", function (err, result) {
        if (err) cb("failure");
        else {
            //  console.log("SUCCESS");
            cb("success");
        }
    })
}

exports.addPointToPost = addPointToPost;

function addPointToPost(definition, username, cb) {
    //   console.log("definition: " + definition);
    //   console.log("username: " + username);
    //var pt = parseInt(points) + 1;
    var newDef = "";
    for (var i = 0; i < definition.length; i++) {
        if (definition[i] == '\'') {
            newDef = newDef.concat('\\');
        }
        newDef = newDef.concat(definition[i]);
    }
    definition = newDef;
    con.query("SELECT points FROM posts WHERE definition = '" + definition + "'", function (err, Points) {
        if (err) {
            cb(err)
        }
        else {
            con.query("UPDATE posts SET points = '" + (Points[0].points + 1) + "' WHERE definition = '" + definition + "'", function (err, result) {
                if (err) throw err; else {
                    con.query("SELECT post_id, users_user_id, wordpage_wp_id FROM posts WHERE definition = '" + definition + "'", function (err, postinfo) {
                        if (err) {
                            cb(err);
                        } else {
                            if (postinfo.length == 0) {
                                cb("this post does not exist");
                            } else {
                                con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, userinfo) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        //  console.log("postid:userid " + postinfo[0].post_id+":"+userinfo[0].user_id);
                                        con.query("INSERT INTO posts_voted VALUE(" + postinfo[0].post_id + ", " + userinfo[0].user_id + ", 1)", function (err, result) {
                                            if (err) {
                                                console.log(err);
                                                cb(err);
                                            }
                                        });
                                        con.query("SELECT points FROM users WHERE user_id = " + postinfo[0].users_user_id, function (err, result) {
                                            if (err) {
                                                cb(err);
                                            } else {
                                                con.query("UPDATE users SET points = " + (result[0].points + 1) + " WHERE user_id = " + postinfo[0].users_user_id, function (err, result) {
                                                    if (err) {
                                                        cb(err);
                                                    }
                                                });
                                                if(postinfo[0].wordpage_wp_id != null) {
                                                    con.query("SELECT totalPoints FROM wordpage WHERE wp_id = " + postinfo[0].wordpage_wp_id, function (err, totalpoints) {
                                                        if (err) {
                                                            cb(err);
                                                        } else {
                                                            con.query("UPDATE wordpage SET totalPoints = " + (totalpoints[0].totalPoints + 1) + " WHERE wp_id = " + postinfo[0].wordpage_wp_id, function (err, result) {
                                                                if (err) {
                                                                    cb(err);
                                                                } else {
                                                                    cb("success");
                                                                }
                                                            });
                                                        }
                                                    });
                                                }else{
                                                    cb("success");
                                                }
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
    });

}

exports.subPointToPost = subPointToPost;

function subPointToPost(definition, username, cb) {
    var newDef = "";
    for (var i = 0; i < definition.length; i++) {
        if (definition[i] == '\'') {
            newDef = newDef.concat('\\');
        }
        newDef = newDef.concat(definition[i]);
    }
    definition = newDef;
    con.query("SELECT points FROM posts WHERE definition = '" + definition + "'", function (err, Points) {
        con.query("UPDATE posts SET points = '" + (Points[0].points - 1) + "' WHERE definition = '" + definition + "'", function (err, result) {
            if (err) throw err; else {
                con.query("SELECT post_id, users_user_id, wordpage_wp_id FROM posts WHERE definition = '" + definition + "'", function (err, postinfo) {
                    if (err) {
                        cb(err);
                    } else {
                        if (postinfo.length == 0) {
                            cb("this post does not exist");
                        } else {
                            con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, userinfo) {
                                if (err) {
                                    cb(err);
                                } else {
                                    con.query("INSERT INTO posts_voted VALUE(" + postinfo[0].post_id + ", " + userinfo[0].user_id + ", 0)", function (err, result) {
                                        if (err) {
                                            cb(err);
                                        }
                                    });
                                    con.query("SELECT points FROM users WHERE user_id = " + postinfo[0].users_user_id, function (err, result) {
                                        if (err) {
                                            cb(err);
                                        } else {
                                            con.query("UPDATE users SET points = " + (result[0].points - 1) + " WHERE user_id = " + postinfo[0].users_user_id, function (err, result) {
                                                if (err) {
                                                    cb(err);
                                                }
                                            });
                                            if(postinfo[0].wordpage_wp_id != null) {
                                                con.query("SELECT totalPoints FROM wordpage WHERE wp_id = " + postinfo[0].wordpage_wp_id, function (err, totalpoints) {
                                                    if (err) {
                                                        cb(err);
                                                    } else {
                                                        con.query("UPDATE wordpage SET totalPoints = " + (totalpoints[0].totalPoints - 1) + " WHERE wp_id = " + postinfo[0].wordpage_wp_id, function (err, result) {
                                                            if (err) {
                                                                cb(err);
                                                            } else {
                                                                cb("success");
                                                            }
                                                        });
                                                    }
                                                });
                                            }else{
                                                cb("success");
                                            }
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
    });

}

exports.deleteVote = deleteVote;

//change to definition and th user id
function deleteVote(definition, username, cb) {
    var postid;
    var userid;
    var newDef = "";
    for (var i = 0; i < definition.length; i++) {
        if (definition[i] == '\'') {
            newDef = newDef.concat('\\');
        }
        newDef = newDef.concat(definition[i]);
    }
    definition = newDef;
    con.query("SELECT post_id, users_user_id FROM posts WHERE definition = '" + definition + "'", function (err, outerpost) {
        if (err) {
            cb(err);
        } else {
            postid = outerpost[0].post_id;
            con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, result) {
                if (err) {
                    cb(err);
                } else {
                    userid = result[0].user_id;
                    con.query("SELECT direction FROM posts_voted WHERE posts_post_id = " + postid + " && users_user_id = " + userid, function (err, Direction) {
                        if (err) {
                            cb(err);
                        } else {
                            if (Direction[0].direction == 1) {
                                //added, now subtract

                                //users table
                                con.query("SELECT points FROM users WHERE user_id = " + outerpost[0].users_user_id, function (err, user) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        con.query("UPDATE users SET points = " + (user[0].points - 1) + " WHERE user_id = " + outerpost[0].users_user_id, function (err, result) {
                                            if (err) {
                                                cb(err);
                                            } else {

                                            }
                                        });
                                    }
                                });

                                //posts table
                                var wpid;
                                con.query("SELECT points, wordpage_wp_id FROM posts WHERE post_id = " + postid, function (err, post) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        con.query("UPDATE posts SET points = " + (post[0].points - 1) + " WHERE post_id = " + postid, function (err, result) {
                                            if (err) {
                                                cb(err);
                                            } else {
                                                con.query("SELECT totalPoints FROM wordpage WHERE wp_id = " + post[0].wordpage_wp_id, function (err, wp) {
                                                    if (err) {
                                                        cb(err);
                                                    } else if(post[0].wordpage_wp_id != null) {
                                                        con.query("UPDATE wordpage SET totalPoints = " + (wp[0].totalPoints - 1) + " WHERE wp_id = " + post[0].wordpage_wp_id, function (err, result) {
                                                            if (err) {
                                                                cb(err);
                                                            } else {

                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });

                                //wordpage table


                                //posts_voted table
                                con.query("DELETE FROM posts_voted WHERE posts_post_id = " + postid + " && users_user_id = " + userid, function (err, result) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        cb("deleted");
                                    }
                                });
                            } else if (Direction[0].direction == 0) {
                                //subtracted, add

                                //users table
                                con.query("SELECT points FROM users WHERE user_id = " + outerpost[0].users_user_id, function (err, user) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        con.query("UPDATE users SET points = " + (user[0].points + 1) + " WHERE user_id = " + outerpost[0].users_user_id, function (err, result) {
                                            if (err) {
                                                cb(err);
                                            } else {

                                            }
                                        });
                                    }
                                });

                                //posts table
                                var wpid;
                                con.query("SELECT points, wordpage_wp_id FROM posts WHERE post_id = " + postid, function (err, post) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        wpid = post[0].wordpage_wp_id;
                                        con.query("UPDATE posts SET points = " + (post[0].points + 1) + " WHERE post_id = " + postid, function (err, result) {
                                            if (err) {
                                                cb(err);
                                            } else {
                                                //wordpage table
                                                con.query("SELECT totalPoints FROM wordpage WHERE wp_id = " + wpid, function (err, wp) {
                                                    if (err) {
                                                        cb(err);
                                                    } else if(post[0].wordpage_wp_id != null){
                                                        con.query("UPDATE wordpage SET totalPoints = " + (wp[0].totalPoints + 1) + " WHERE wp_id = " + wpid, function (err, result) {
                                                            if (err) {
                                                                cb(err);
                                                            } else {

                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });


                                //posts_voted table
                                con.query("DELETE FROM posts_voted WHERE posts_post_id = " + postid + " && users_user_id = " + userid, function (err, result) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        cb("deleted");
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });


}

exports.getVotes = getVotes;

function getVotes(definition, username, cb) {
    var postid;
    var userid;
    //console.log("voted definition: "+definition);
    var newDef = "";
    for (var i = 0; i < definition.length; i++) {
        if (definition[i] == '\'') {
            newDef = newDef.concat('\\');
        }
        newDef = newDef.concat(definition[i]);
    }
    definition = newDef;
    //console.log("new Definition: " + definition);
    con.query("SELECT post_id FROM posts WHERE definition = '" + definition + "'", function (err, result) {
        if (err) {
            cb(err);
        } else {
            postid = result[0].post_id;
            con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, result) {
                if (err) {
                    cb(err);
                } else {
                    userid = result[0].user_id;
                    con.query("SELECT * FROM posts_voted WHERE posts_post_id = " + postid + " && users_user_id = " + userid, function (err, result) {
                        if (err) {
                            cb(err);
                        } else {
                            var z = JSON.parse(JSON.stringify(result));
                            cb(z);
                        }
                    });
                }
            });
        }
    });


}

exports.getPassword = getPassword;

function getPassword(username, cb) {
    //  console.log(username)
    if (username.length == 0) {
        cb("username field cannot be empty");
    } else if (username.length > 45) {
        cb("username is too long");
    } else {
        con.query("SELECT password FROM users WHERE username = '" + username + "'", function (err, result) {
            //console.log(result);
            if (err) cb("user not found");
            else {
                if (result.length == 0) {
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
    con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, uid) {
        // console.log(uid[0]);
        if (uid.length == 0) {
            cb("user does not exist");
        }
        else {
            con.query("DELETE FROM posts WHERE users_user_id = " + uid[0].user_id, function (err, result) {
                //  console.log(err);
                if (err) cb("error deleting posts associated with this user");
                /*else  {
                    cb("deletion successful");
                }*/
            });
            con.query("DELETE FROM users WHERE username = '" + username + "'", function (err, result) {
                //    console.log(err);
                if (err) cb("error deleting user");
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
    con.query("DELETE FROM posts_voted WHERE posts_post_id = " + pid, function (err, result) {
        if (err) {
            cb(err);
        } else {
            con.query("DELETE FROM posts WHERE post_id = " + pid, function (err, result) {
                if (err) cb("error deleting post");
                else {
                    var z = JSON.parse(JSON.stringify(result[0]));
                    cb(z);
                }
            });
        }
    });

}

//delete for wp
exports.deleteWord = deleteWord;

function deleteWord() {

}


//update user info functions
exports.updateUsername = updateUsername;

function updateUsername(oldUsername, newUsername, cb) {
    if (newUsername.length == 0) {
        cb("new username invalid: cannot have length 0");
    } else if (newUsername.length > 45) {
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
                        } else if (result.affectedRows == 0) {
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
    con.query("SELECT password FROM users WHERE username = '" + username + "'", function (err, oldPasswordreturn) {
        //  console.log(oldPasswordreturn);
        if (err) {
            cb(err);
        } else if (oldPasswordreturn[0].password != oldPassword) {
            cb("old password is incorrect");
        } else if (oldPasswordreturn[0].password == oldPassword) {
            if (newPassword.length == 0) {
                cb("new password invalid: cannot have length 0");
            } else if (newPassword.length > 45) {
                cb("new password invalid: too long");
            } else {
                con.query("UPDATE users SET password = '" + newPassword + "' WHERE username = '" + username + "'", function (err, result) {
                    if (err) {
                        cb(err);
                    } else {
                        if (result.affectedRows == 1) {
                            cb("update successful: password");
                        } else if (result.affectedRows == 0) {
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
    if (newEmail.includes("@")) {
        con.query("UPDATE users SET email = '" + newEmail + "' WHERE username = '" + username + "'", function (err, result) {
            if (err) {
                cb(err);
            } else {
                if (result.affectedRows == 1) {
                    cb("update successful: email");
                } else if (result.affectedRows == 0) {
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
    if (newFirstName.length > 45) {
        cb("invalid first name: too long.");
    } else {
        con.query("UPDATE users SET first_name = '" + newFirstName + "' WHERE username = '" + username + "'", function (err, result) {
            if (err) {
                cb(err);
            } else {
                if (result.affectedRows == 1) {
                    cb("update successful: first name");
                } else if (result.affectedRows == 0) {
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
    if (newLastName.length > 45) {
        cb("invalid last name: too long.");
    } else {
        con.query("UPDATE users SET last_name = '" + newLastName + "' WHERE username = '" + username + "'", function (err, result) {
            if (err) {
                cb(err);
            } else {
                if (result.affectedRows == 1) {
                    cb("update successful: last name");
                } else if (result.affectedRows == 0) {
                    cb("update failed: last name");
                } else {
                    cb("catastrophic internal corruption: last name");
                }
            }

        });
    }
}

exports.updateProfileImg = updateProfileImg;

function updateProfileImg(username, img, cb) {
    con.query("UPDATE users SET profile_img = '" + img + "' WHERE username = '" + username + "'", function (err, resul) {
        if (err) {
            cb(err);
        } else {
            cb("updated profile image");
        }
    });
}

exports.postSuggestion = postSuggestion;

function postSuggestion(username, suggestion, cb) {
    //NULL, NOW(), 0, 'suggestion', suggestion, user_id, wp_id_for_suggestion_page
    con.query("SELECT user_id FROM users WHERE username = '" + username + "'", function (err, user) {
        if (err) {
            cb(err);
        } else {
            con.query("SELECT wp_id FROM wordpage WHERE word = 'suggestionPage'", function (err, page) {
                if (err) {
                    cb(err);
                } else {
                    con.query("INSERT INTO posts VALUE(NULL, NOW(), 0, 'suggestion'," + user[0].user_id + ", " + page[0].wp_id + ")", function (err, result) {
                        if (err) {
                            cb(err);
                        } else {
                            cb("suggestion posted");
                        }
                    });
                }
            });
        }
    });
}

exports.subscribeUser = subscribeUser;

function subscribeUser(username, cb) {
    con.query("UPDATE users SET notification = 1 WHERE username = '" + username + "'", function (err, result) {
        if (err) {
            cb("subscription error");
        } else {
            cb("user subscribed");
        }
    });
}

exports.unsubscribeUser = unsubscribeUser;

function unsubscribeUser(username, cb) {
    con.query("UPDATE users SET notification = 0 WHERE username = '" + username + "'", function (err, result) {
        if (err) {
            cb("unsubscription error");
        } else {
            cb("user unsubscribed");
        }
    });
}

exports.addSuggestionImage = addSuggestionImage;

function addSuggestionImage(image, username, cb) {
    getUserByUsername(username, function (user_id) {
        con.query("INSERT INTO posts VALUE ( NULL, NOW(), 0 , 'suggestion_image', '" + image + "', " + user_id + ", NULL)", function (err, result) {
            if (err) {
                cb("suggest image error");
            } else {
                cb("image suggested");
            }
        });
    });
}

exports.addSuggestionText = addSuggestionText;

function addSuggestionText(text, username, cb) {
    getUserByUsername(username, function (user_id) {
        con.query("INSERT INTO posts VALUE ( NULL, NOW(), 0 , 'suggestion_text', '" + text + "', " + user_id + ", NULL)", function (err, result) {
            if (err) {
                cb("suggest text error");
            } else {
                cb("text suggested");
            }
        });
    });
}

exports.getSuggestionText = getSuggestionText;

function getSuggestionText(cb) {
    con.query("SELECT points, definition FROM posts WHERE content_type = 'suggestion_text'", function (err, result) {
        if (err) {
            cb("error getting suggested texts");
        } else {
            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}

exports.getSuggestionImage = getSuggestionImage;

function getSuggestionImage(cb) {
    con.query("SELECT points, definition FROM posts WHERE content_type = 'suggestion_image'", function (err, result) {
        if (err) {
            cb("error getting suggested images");
        } else {
            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}

exports.getCurrentMilestone = getCurrentMilestone;
function getCurrentMilestone(username, cb) {
    con.query("SELECT milestone FROM users WHERE username = '" + username + "'", function(err, result) {
        if(err) {
            cb(err);
        } else {
            var z = JSON.parse(JSON.stringify(result[0].milestone));
            cb(z);
        }
    });
}

exports.incrementMilestone = incrementMilestone;
function incrementMilestone(username, cb) {
    var currentMilestone;
    getCurrentMilestone(username, function(result) {
        currentMilestone = result;
        con.query("UPDATE users SET milestone = " + (currentMilestone +1) + " WHERE username = '" + username + "'", function(err, result) {
            if(err) {
                cb(err);
            } else {
                cb("success");
            }
        });
    });
}

exports.convertSuggestion = convertSuggestion;
function convertSuggestion(definition, cb) {
    var newDef = "";
    for (var i = 0; i < definition.length; i++) {
        if (definition[i] == '\'') {
            newDef = newDef.concat('\\');
        }
        newDef = newDef.concat(definition[i]);
    }
    definition = newDef;
    con.query("SELECT post_id FROM posts WHERE definition = '" + definition + "'", function(err, postid) {
        if(err) {
            cb(err);
            return;
        } else {
            con.query("DELETE FROM posts_voted WHERE posts_post_id = " + postid[0].post_id, function(err, result) {
                if(err) {
                    cb(err);
                    return;
                }
            });
            //console.log(postid);
            con.query("SELECT content_type FROM posts WHERE post_id = " + postid[0].post_id, function(err,contenttype) {
              //  console.log(contenttype);
                con.query("DELETE FROM posts WHERE post_id = " + postid[0].post_id, function(err, result) {
                    if(err) {
                        cb(err);
                        return
                    }
                });
                if(contenttype[0].content_type == "suggestion_text") {
                    con.query("INSERT INTO wordpage VALUE(NULL, 'word','" + definition + "', 0)", function(err, result) {
                        if(err) {
                            cb(err);
                            return;
                        }
                        else {
                            cb("success");
                            return;
                        }
                    });
                } else if(contenttype[0].content_type == "suggestion_image") {
                    con.query("INSERT INTO wordpage VALUE(NULL, 'image','" + definition + "', 0)", function(err, result) {
                        if(err) {
                            cb(err);
                            return
                        }
                        else {
                            cb("success")
                            return;
                        }
                    });
                }
            });
            cb("success");
        }
    });
}

exports.getPointsFromPost = getPointsFromPost;
function getPointsFromPost(definition, cb) {
    var newDef = "";
    for (var i = 0; i < definition.length; i++) {
        if (definition[i] == '\'') {
            newDef = newDef.concat('\\');
        }
        newDef = newDef.concat(definition[i]);
    }
    definition = newDef;
    con.query("SELECT points FROM posts WHERE definition = '" + definition + "'", function(err, result) {
        if(err) {
            cb(err);
        } else {
            var z = JSON.parse(JSON.stringify(result[0].points));
            cb(z);
        }
    });
}

exports.deleteSuggestion = deleteSuggestion;
function deleteSuggestion(definition, cb) {
    var newDef = "";
    for (var i = 0; i < definition.length; i++) {
        if (definition[i] == '\'') {
            newDef = newDef.concat('\\');
        }
        newDef = newDef.concat(definition[i]);
    }
    definition = newDef;

    con.query("SELECT post_id FROM posts WHERE definition = '" + definition + "'", function(err, post) {
        if(err) {
            cb(err);
        } else {
            con.query("DELETE FROM posts WHERE post_id = " + post[0].post_id, function(err, result) {
                if(err) {
                    cb(err);
                }
            });
            con.query("DELETE FROM posts_voted WHERE posts_post_id = " + post[0].post_id, function(err, result) {
                cb(err);
            })
        }
    });
    cb("success");
}

exports.getUserEmailforSelectedword = getUserEmailforSelectedword;
function getUserEmailforSelectedword(definition,cb) {
    var sql = "select users_user_id from posts where content_type='suggestion_text' and definition='"+ definition +"'";

    con.query(sql,function (err,result){
        if (err){
            console.log("failed?")
            cb("failure");
        }else {
            var z = JSON.parse(JSON.stringify(result[0].users_user_id));
            console.log(z);
            var sql2 = "select email from users where user_id=" + z;
            console.log(sql2);
            con.query(sql2,function (err1,result1) {
                if (err1){
                    cb("failure");
                }else {
                    var z = JSON.parse(JSON.stringify(result1[0].email));
                    cb(z);
                }
            })

        }
    });
}

exports.getUserEmailforSelectedimage = getUserEmailforSelectedimage;
function getUserEmailforSelectedimage(definition,cb) {
    var sql = "select users_user_id from posts where content_type='suggestion_image' and definition='"+ definition +"'";

    con.query(sql,function (err,result){
        if (err){
            console.log("failed?");
            cb("failure");
        }else {
            var z = JSON.parse(JSON.stringify(result[0].users_user_id));
            console.log(z);
            var sql2 = "select email from users where user_id=" + z;
            console.log(sql2);
            con.query(sql2,function (err1,result1) {
                if (err1){
                    cb("failure");
                }else {
                    var z = JSON.parse(JSON.stringify(result1[0].email));
                    cb(z);
                }
            })

        }
    });
}


/*function getImageData(image) {
    var fs = require('fs');
    fs.readFile(image, function(err, result) {
        if(err) throw err;
        else{
            console.log(result);
            fs.writeFile("/home/ayush/Desktop/output.txt", result, function(err) {
                if(err)throw(err);
            });
        }
    });
}

getImageData("/home/ayush/Desktop/files-and-javascript-10-638.jpg");*/