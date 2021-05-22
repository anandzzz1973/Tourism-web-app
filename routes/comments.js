// ====================
// comment routing 
// ====================
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User   = require("../models/user")


router.get("/campground/:id/comment/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,data){
        if(err)
        console.log(err);
        else
        res.render("comment/new.ejs",{campground: data});
    });
});

router.post("/campground/:id/comment",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        console.log(err);
        else
        {
            var obj = {
                text: req.body.text,
                author: req.body.author,
            };

            console.log(obj);
            // console.log(req.user.username);

            Comment.create(obj,function(err,comment){
                if(err)
                console.log(err);
                else
                {
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    campground.comment.push(comment);
                    comment.save();
                    campground.save();  
                        
                    res.redirect("/campground");
                }
            });
        }
    });
});

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