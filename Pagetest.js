const test = require('tape');
//const page = require('./Communicator')
const connection = require('./Controllers/Connection');

test('test if words are found', function (t) {
    var word = "Artificial Intelligence";

    if (connection.getwpFromWord(word,function(wpid){
            if (wpid<1){
                console.log("Test failed: Retrieved the wrong word\n\n")
            }else {
                console.log("Test passed\n\n")
                //t.end();
            }
            t.end()
        })
    )
        t.end()
});


test('test if user is found', function (t) {
    var username ="barryuser";
    var userid = 4;

    if (connection.findUserByUsername(username,function (user) {
            //console.log(user["user_id"])
            if (user == undefined){
                console.log("Test failed: Retrieved no user\n\n")
            }else if (user["user_id"] == userid ) {
                console.log("Test passed: User found correctly\n\n")
                //t.end();
            }
            t.end()
        }))
    t.end()
});


test('test to check if email can be added', function (t) {
    var email = "a@email.com";
    var em = "a";

    t.notEquals(connection.addMailingList(email, function (cb) {cb.toString()}) , "failure" , "Able to register emails");
    t.equals(connection.addMailingList(email,function (cb) {cb.toString()}),undefined,"Wrong emails do not work");
    console.log("\n\n");
    t.end()
});



test('test to check if users can be registered ', function (t){

    var email = "newemail";
    var username = "l";
    var username2 = "newuser2"
    var password = "pass1";
    var firstname = "firstname";
    var lastname = "lastname";

    connection.registerUser(email,username,password,firstname,lastname,function (cb){
        t.notEquals(cb,"failure registering user","Able to register user without null");
    });

    connection.registerUser(email,username,password,firstname,lastname,function (cb){
        t.equals(cb,"failure registering user","Users with same user name don't register");
    });

    connection.registerUser(email,username2,password,null,null,function (cb){
        t.notEquals(cb,"failure registering user","Users with same user name don't register");
    });

    connection.deleteUser(username,function (cb) {
        t.equals(cb,"deletion successful","Deletion works");
    });

    connection.deleteUser(username2,function (cb) {
        t.equals(cb,"deletion successful","Deletion works");
    });

    // connection.deleteUser(username,function (cb) {
    //     t.notEquals(cb,"deletion successful","Deletion works");
    // });

    t.end();

});

//onexit(1);
//
 console.log("rn")

