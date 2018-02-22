var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    //password will need to be replaced with local root password
    //password: "sql123",
    password: "Overdrive#11",
    database: "expressionary_data"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected")
});

//if one field does not exist whole query returns null
function getwpFromWord(word) {
    /*var request = "SELECT posts.date, posts.definition, posts.points, user.username, wordpage.totalPoints FROM wordpage, posts, users WHERE wordpage.word = " + word + "," +
        "posts.wordpage_wp_id = wordpage.wp_id, users.user_id = posts.users_user_id";
    var wordPageData = [];
    var wordId = 0;
    con.query(request, function(err, result) {
        if(err) return "notFound";
        for(var i in result) {
            wordPageData.push(i);
        }
        console.log(result);
    });*/
    //var wordPageData = [];
    var requestWord = "SELECT wp_id, totalPoints FROM wordpage WHERE word = '" + word + "'";
    //console.log(requestWord);
    con.query(requestWord, function(err, result) {
        if(err) return "notFound";
        //for(var i in result) {
        //    wordPageData.push(i);
        //}
        //format: [RowDataPacket { wp_id: int, totalPoints: int}]
        return(result);
    });
}

function getPostsFromWordId(wp_id) {
    var request = "SELECT posts.date, posts.points, posts.definition, users.username FROM posts, users WHERE posts. wordPage_wp_id = " + wp_id + "&& posts.users_user_id = users.user_id";
    con.query(request, function(err, results) {
        if(err) return "notFound";
        else {
            //format: [RowDataPacket { date: datetime variable, points: 0, definition: text, username: text}]
            return(results);
        }
    });
}

function findUserByEmail(email) {

}

function findUserByUsername(username) {

}

function getPassword(username) {

}