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

    sql = "select word from wordpage where wp_id=4 group by wp_id"

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});

