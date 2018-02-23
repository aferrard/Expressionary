const test = require('tape')
//const page = require('./Communicator')
const connection = require('./Controllers/Connection')



// test('page should return random unexpected numbers',function (t) {
//         var result = page.randomIndex(10);
//         const expected = 5;
//         if (result==expected){
//             result = page.randomIndex(10);
//             if (result==expected){
//                 result = page.randomIndex(10);
//                 if (result==expected){
//                     console.log("Test failed")
//                 }
//             }
//
//         }
//         console.log("Test passed\n")
//         t.end()
//     }
// )


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
})




test('test if user is found', function (t) {
    var username ="barryuser";
    var userid = 4

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
})




test('test to check if email can be added', function (t) {
    var email = "a@email.com"

    console.log("user_id")
     connection.addMailingList(email,function (cb) {
        //    console.log("user_id")
     if (cb.toString() == "failure"){
         console.log("Test failed : Unable to the add to the mailing list")

     }else {
         console.log("Test passed : Added to the mailing list\n\n")
                //t.end();
     }
           // t.end()
     })
    t.end()
})
//
// console.log("rn")