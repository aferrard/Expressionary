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
        console.log(result);
        return(result);
    });
}

function getPostsFromWordId(wp_id) {
    var request = "SELECT posts.date, posts.points, posts.definition, users.username FROM posts, users WHERE posts. wordPage_wp_id = " + wp_id + "&& posts.users_user_id = users.user_id";
    con.query(request, function(err, results) {
        if(err) return "notFound";
        else {
            //format: [RowDataPacket { date: datetime variable, points: 0, definition: text, username: text}, RowDataPacket ...]
            console.log(results);
            return(results);
        }
    });
}

function registerUser(email, username, password, firstName, lastName) {
    //firstName, LastName can = "NULL" [optional]
    var request = "INSERT INTO users VALUE(NULL, 0, '" + email + "', '" + username +"', '"+password+"', '"+ firstName+ "', '"+lastName+"')";
    //console.log(request);
    con.query(request, function(err, result) {
        if(err) return("error while registering user");
        //console.log(result);
        return result;
    });
}

function checkLogin(username) {
    //given username, check password
    var request = "SELECT password FROM users WHERE username = '" + username + "'";
    //console.log(request);
    //format: [ RowDataPacket {password: text}]
    con.query(request, function(err,  result) {
        if(err) return "error in checkLogin";
        //console.log(result.length);
        //empty array if not found
        return(result);
    });
}

function findUserByEmail(email) {

}

function findUserByUsername(username) {

}

//getwpFromWord("Human");
//getPostsFromWordId(1);
//registerUser("thatguy@email.com", "thatguy", "thatguypass", "NULL", "NULL");
//checkLogin("ayushuser");
//registerUser("uniquetest@email.com", "thatguy", "thatguyotherpass", "NULL", "NULL"); should return error due to violation fo unique username