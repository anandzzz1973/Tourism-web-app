var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User   = require("../models/user")


router.get("/",function(req,res){
    res.render("landing.ejs");
});

//==================================================
//authentications route  
//=================================================

//register====================================== 
router.get("/register",function(req,res){
    
    res.render("register.ejs");
});


router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}), req.body.password , function(err, user){
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }

        passport.authenticate("local")(req,res,function(){
            res.redirect("/campground");
        });
    });
});

//==============================
//login
//==============================
router.get("/login",function(req,res){
    res.render("login.ejs");
});

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campground",
    failureRedirect: "/login"
}),function(req,res){
});

//================================
//logout
//================================
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

//======================================
//check authentication middleware
//======================================
function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    else
    {console.log("error")
    res.redirect("/login");}
};

module.exports = router;