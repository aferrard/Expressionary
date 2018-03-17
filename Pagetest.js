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
    var username = "newuser";
    var username2 = "newuser2"
    var password = "pass1";
    var firstnamenull= null;
    var lastnamenull = null;
    var firstname = "firstname";
    var lastname = "lastname";

    t.notEquals(connection.registerUser(email,username,password,firstname,lastname,function (cb){cb.toString()}),"failure registering user\n","Able to register user without null")
    t.equals(connection.registerUser(email,username,password,firstname,lastname,function (cb){cb.toString()}),undefined,"Users with same user name don't register")
    t.notEquals(connection.registerUser(email,username2,password,null,null,function (cb){cb.toString()}),"failure registering user\n","Able to register user with null")

    t.equals(connection.deleteUser(username,function (cb) {cb.toString()}),"deletion successful","works");
    t.equals(connection.deleteUser(username,function (cb) {cb.toString()}),"deletion successful","works");

    t.end();

});

//onexit(1);
//
 console.log("rn")

