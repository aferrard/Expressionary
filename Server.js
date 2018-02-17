var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path));

router.use(function (req,res,next) {
    console.log("/" + req.method);
    next();
});

router.get("/",function(req,res){
    res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
    res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
    res.sendFile(path + "contact.html");
});
router.get("/word",function(req,res){
    res.sendFile(path + "Word.html");
});
app.use("/",router);
app.get("/contact", function(req, res) {
    var name = req.param('name');
    var email = req.param('email');
    var message = req.param('message');
    //res.send(name + ' ' + email + ' ' + message);
});
app.post("/contact", function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    res.send(name + ' ' + email + ' ' + message);
})

app.use("*",function(req,res){
    res.sendFile(path + "404.html");
});
const myModule = require('./Communicator');
var val = myModule.hello();



app.listen(3000,function(){
    console.log("Live at Port 3000");
    val;
});
