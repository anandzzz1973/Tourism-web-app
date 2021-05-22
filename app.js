var express = require('express');
var app = express();

var bodyparser = require('body-parser');
const { response } = require('express');
app.use(express.urlencoded({extended: true})); 

// database connection with mongoose
var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/tourism_web_app",{ 
    useUnifiedTopology: true ,useNewUrlParser: true 
});

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user")

var passport               = require("passport");
var localstrategy          = require("passport-local");
var passposrtlocalmongoose = require("passport-local-mongoose");

var methodoverride = require("method-override");

app.use(require("express-session")({
    secret: "anand , you will be red coder in one year",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================================================
// var seedDB = require("./seed");
// seedDB();

app.use(function(req,res,next){
    res.locals.curuser = req.user;
    next();
});

//=======================================================
var campgroundroutes = require("./routes/campground");
var commentroutes = require("./routes/comments");
var indexroutes = require("./routes/index");

app.use(methodoverride("_method"));
app.use(campgroundroutes);
app.use(commentroutes);
app.use(indexroutes);

app.listen(3000,function(){
    console.log("server is ready to use anand bhai");
});