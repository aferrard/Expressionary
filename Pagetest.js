const test = require('tape');
//const page = require('./Communicator')
const connection = require('./Controllers/Connection');
var tvar = 0;

if (process.argv[2] == "reg_test") {
    tvar = 1;
}else if (process.argv[2] == "log_test"){
    tvar = 2;
}else if (process.argv[2] == "point_test"){
    tvar = 3;
}else if (process.argv[2]== "edit_test"){
    tvar = 4;
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

if (tvar == 1 ) {

    test('REGISTERATION AND UNIQUE USER TESTS\n10 UNIT TESTS', function (t) {


        var email = "tempemail";
        var username = "tempuser";
        var username2 = "tempuser2";
        var username3 = "tempuser3butthisuserissupposedtobemorethen45charachterslongsoshouldntregisterletsseeifitworks";
        var username4 = "tempuser4";
        var password = "temppass1";
        var firstname = "firstname";
        var lastname = "lastname";
        var existinguser = username;


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

        connection.registerUser(email,username4,password,firstname,lastname,function (cb) {
            t.notEquals(cb, "failure registering user", "Users can register with null first and last name");
        });

        connection.registerUser(email,"",password,firstname,lastname,function (cb) {
            t.equals(cb, "username field cannot be empty", "Users cannot register with empty username");
        });

        connection.registerUser(email,username3,password,firstname,lastname,function (cb) {
            t.equals(cb, "username is too long", "Username cannot be More then 45 charachters");
        });

        connection.registerUser(email,username3,password,firstname,lastname,function (cb) {
            t.equals(cb, "username is too long", "Multiple tries don't work and Username can be More then 45 charachters");
        });

        connection.registerUser(email,"",password,firstname,lastname,function (cb) {
            t.equals(cb, "username field cannot be empty", "Robustness");
        });

        connection.deleteUser(username, function (cb) {
            t.equals(cb, "deletion successful", "Deletion works/Cleanup");
        });

        connection.deleteUser(username2,function (cb) {
            t.equals(cb,"deletion successful","Deletion works")
        });

        connection.deleteUser(username4, function (cb) {
            t.equals(cb, "deletion successful", "Deletion works/Cleanup");
        });
        t.end();
    });
}

if (tvar == 2) {
    test('LOGIN TESTS\n5 UNIT TESTS 6 MANUAL TESTS', function (t) {
        var username = 'a';
        var username2 = 'bpq';
        var username3 = '';
        var username4 = 'tempuser3butthisuserissupposedtobemorethen45charachterslongsoshouldntregisterletsseeifitworks';
        var user1 = 'user1';
        var pass1 = 'a';

        connection.getPassword(username2, function (cb) {
            t.equals(cb, "user does not exist", "Non Existent User cannot be pulled")
        });

        connection.getPassword(username,function (cb) {
            t.notEquals(cb, "user does not exist", "Existing Users can be pulled")
        });

        connection.getPassword(username3, function (cb) {
            t.equals(cb, "username field cannot be empty", "Empty username cannot be used to login")
        });

        connection.getPassword(username4, function (cb) {
            t.equals(cb, "username is too long", "Username cannot be more then 45 charachters long")
        });

        connection.getPassword(username,function (cb) {
            t.equals(cb.password, pass1, "The correct password is being returned")
        });

        //8 MANUAL TESTS

        t.end();
    });
}

if (tvar == 3){
    test('USER STORY #4, Points Test\n 6 TESTS',function (t) {

        var testword = "human";
        var wordid = 1;
        var post = "homosapien";
        var points = 0;

        connection.getwpFromWord(testword,function (result) {
           t.equals(result,wordid,"Given the word the function returns the correct word ID")
        });

        connection.getPostsFromWordId(1,function (result) {
            post = result[0].definition;
            points = result[0].points;
            t.notEquals(result,undefined,"Functions are able to return the post and the points assosiated with a word")

            connection.addPointToPost(post,points,function (result) {
                t.equals(result,"success","function can add points can be added to the post")
            });

            connection.getPostsFromWordId(1,function (result) {
                t.equals(result[0].points,points+1,"verifying points were incremented properly");
            });

            connection.subPointToPost(post,points,function (result) {
                t.equals(result,"success","function can subtract points can be added to the post")
            });

            connection.getPostsFromWordId(1,function (result) {
                t.equals(result[0].points,points-1,"verifying points were decremented properly");
            });
        });
        t.end();
    });
}

if (tvar == 4){
    test('USER STORY #8, Edit Information Test\n 6 TESTS',function (t) {

        var oldusername = "old-username";
        var newusername = "new-username";
        var oldemail = "old@yahoo.com";
        var newemail = "new@yahoo.com";
        var oldpassword = "oldpass";
        var newpassword = "newpass";
        var oldfirstname = "old-firstname";
        var newfistname = "new-firstname";
        var oldlastname = "old-lastname";
        var newlastname = "new-lastname";

   //     connection.updateUsername(oldusername,newusername,function(result){
     //       t.equals(result,"update successful: username","User Name Updated Successfully")
      //  });
        connection.registerUser(oldemail,oldusername,oldpassword,oldfirstname,oldlastname,function (result) {
           t.notEquals("failure registering user",result,"Registred user successfully");
        });
        connection.updateEmail(oldusername,newemail,function (result) {
            t.equals(result,"update successful: email","Email updated successfully")
        });
        connection.updateFirstName(oldusername,newfistname,function(result){
            t.equals(result,"update successful: first name","First Name updated Successfully")
        });

        connection.updateLastName(oldusername,newlastname,function(result){
            t.equals(result,"update successful: last name","Last Name updated Successfully")
        });

        connection.deleteUser(oldusername,function(result){
            t.equals(result,"deletion successful","Deletion/Clean up")
        })

    });
}
//onexit(1);
//


