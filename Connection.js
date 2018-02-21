var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected")

    var sql = "USE expressionary_data"
    con.query(sql, function (err, result) {
        if (err) throw err;
      //  console.log("Result: " + result);
    });

    sql = "SELECT word  from wordpage WHERE wp_id = 4"

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});

