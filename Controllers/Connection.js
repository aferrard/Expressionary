var mysql = require('mysql');

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


//if one field does not exist whole query returns null
exports.getwpFromWord = getwpFromWord;
function getwpFromWord(word, cb) {
    con.query("SELECT wp_id FROM wordpage WHERE word = '" + word + "'", function(err, result) {
        //var z = JSON.parse(z);
        //console.log("WORD: " + word);
        //console.log("RESULT: " + result);
        var z = JSON.parse(JSON.stringify(result[0]));

        cb(z.wp_id);
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
    var request = "SELECT * FROM posts WHERE wordPage_wp_id = " + wp_id + "";
    con.query(request, function(err, result) {
        if(err) return "notFound";
        else {
            //format: [RowDataPacket { date: datetime variable, points: 0, definition: text, username: text}]

            var z = JSON.parse(JSON.stringify(result));
            cb(z);
        }
    });
}
exports.getWordPages = getWordPages;
function getWordPages(cb) {
    con.query("SELECT word FROM wordPage", function(err, result) {
        var z = JSON.parse(JSON.stringify(result));
        //console.log(z);
        cb(z);
    });
}
exports.getUsernameByPost = getUsernameByPost;
function getUsernameByPost(post, cb) {
    userById(post.users_user_id, function(username) {
        cb(username);
    })
}
function findUserByEmail(email) {

}
function userById(id, cb) {
    con.query("SELECT username FROM users WHERE user_id = " + id + "", function(err, result) {
        var z = JSON.parse(JSON.stringify(result[0].username));
        console.log("USERNAME: " + z);
        cb(z);
    })
}

function findUserByUsername(username) {

}

function getPassword(username) {

}