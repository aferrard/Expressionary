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
    var word = "Lifea";
    var addword =connection.addWord(word)
    console.log(addword)
    //var getword = getwp;

    if (addword == undefined) {
        console.log("Test failed: Could not add word");
        t.end()
        return
    }

    if (connection.getwpFromWord(word,function(wpid){
            if (wpid<1){
                console.log("Test failed: Retrieved the wrong word")
            }else {
                console.log("Test passed\n")
                //t.end();
            }
            t.end()
        })
    )
    t.end()
})

// test('test if user is found', function (t) {
//     var username ="barryuser";
//     var expecteduser="";
//     //var adduser =connection.
//     //console.log(addword)
//     //var getword = getwp;
//     //
//     // if (adduser == undefined) {
//     //     console.log("Test failed: Could not add word");
//     //     t.end()
//     //     return
//     // }
//
//     if (connection.findUserByUsername(user,function (user) {
//             if (user == undefined){
//                 console.log("Test failed: Retrieved no user")
//             }else if (user.toString() == expecteduser.toString()) {
//                 console.log("Test passed\n")
//                 //t.end();
//             }
//             t.end()
//
//
//         }))
//         t.end()
// })
//
//
// console.log("rn")