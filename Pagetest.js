const test = require('tape');
//const page = require('./Communicator')
const connection = require('./Controllers/Connection');
var tvar = 0;

if (process.argv[2] == "reg_test") {
    tvar = 1;
}else if (process.argv[2] == "log_test"){
    tvar = 2;
}


if (tvar == 0) {
    test('test if words are found', function (t) {
        var word = "Artificial Intelligence";

        if (connection.getwpFromWord(word, function (wpid) {
                if (wpid < 1) {
                    console.log("Test failed: Retrieved the wrong word\n\n")
                } else {
                    console.log("Test passed\n\n")
                    //t.end();
                }
                t.end()
            })
        )
            t.end()
    });

    test('test if user is found', function (t) {
        var username = "barryuser";
        var userid = 4;

        if (connection.findUserByUsername(username, function (user) {
                //console.log(user["user_id"])
                if (user == undefined) {
                    console.log("Test failed: Retrieved no user\n\n")
                } else if (user["user_id"] == userid) {
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

        t.notEquals(connection.addMailingList(email, function (cb) {
            cb.toString()
        }), "failure", "Able to register emails");
        t.equals(connection.addMailingList(email, function (cb) {
            cb.toString()
        }), undefined, "Wrong emails do not work");
        console.log("\n\n");
        t.end()
    });

}
//array[i].points

if (tvar == 1 ) {
    test('REGISTERATION AND UNIQUE USER TESTS\n10 TESTS', function (t) {


        var email = "tempemail";
        var username = "tempuser";
        var username2 = "tempuser2";
        var username3 = "tempuser3";
        var password = "temppass1";
        var firstname = "firstname";
        var lastname = "lastname";
        var existinguser = "";


        connection.registerUser(email, username, password, firstname, lastname, function (cb) {
            t.notEquals(cb, "failure registering user", "Able to register user without null first and last name");
        });

        connection.registerUser(email, username, password, firstname, lastname, function (cb) {
            t.equals(cb, "failure registering user", "New users cannot register twice");
        });

        connection.registerUser(email, username, password, firstname, lastname, function (cb) {
            t.equals(cb, "failure registering user", "Robustness to check if same users register on multiple tries");
        });

        connection.registerUser(email, existinguser, password, firstname, lastname, function (cb) {
            t.equals(cb, "failure registering user", "Already Existing Usernames cannot be used to register");
        });

        connection.registerUser(email, username2, password, firstname, lastname, function (cb) {
            t.notEquals(cb, "failure registering user", "multiple users can register");
        });

        connection.registerUser(email,username3,password,firstname,lastname,function (cb) {
            t.notEquals(cb, "failure registering user", "Users can register with null first and last name");
        });
        // test for max length
        // test for 0 length

        connection.deleteUser(username, function (cb) {
            t.equals(cb, "deletion successful", "Deletion works/Cleanup");
        });


        // connection.deleteUser(username,function (cb) {
        //     t.notEquals(cb,"deletion successful","Deletion works")
        // });

        connection.deleteUser(username2, function (cb) {
            t.equals(cb, "deletion successful", "Deletion works/Cleanup");
        });

        connection.deleteUser(username3, function (cb) {
            t.equals(cb, "deletion successful", "Deletion works/Cleanup");
        });
        //tvar = 1;
        t.end();

    });
}
if (tvar == 2) {

    test('LOGIN TESTS\n10 TESTS', function (t) {
        var username = 'a';
        var username2 = 'bpq';

        connection.getPassword(username2, function (cb) {
            t.equals(cb, "user does not exist", "Non Existent User cannot be pulled")
        });

        connection.getPassword(username,function (cb) {
            t.notEquals(cb, "user does not exist", "Existing Users can be pulled")
        });

        //MAX LENGTH
        //0 LENGTH

        //8 MANUAL TESTS


        t.end();
    });

}
//onexit(1);
//


