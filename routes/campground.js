var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User   = require("../models/user")


router.get("/campground",isLoggedIn,function(req,res){
    // var campgrounds = campground;
    // res.render("campground.ejs",{campground : campgrounds});
    Campground.find({},function(err,allcampground){
        if(err)
        console.log("something went wrong");
        else
        {
            res.render("campground/index.ejs",{campground : allcampground});
        }
    });
});

router.post("/campground",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id : req.user._id,
        username : req.user.username,
    };
    var newcampground = {name: name, image: image, description: desc,author: author};

    Campground.create(newcampground,function(err,abcd){
        if(err)
        console.log("something went wrong");
        else
        console.log(abcd);
    })

    res.redirect("/campground");
});

router.get("/campground/:id/edit",ownweship,function(req,res){
    Campground.findById(req.params.id,function(err,data)
    {
        if(err)
        console.log(err);
        else{
            console.log(data);
            res.render("campground/edit.ejs",{campground: data});
        }
    })
    
});

router.put("/campground/:id",function(req,res){
    var obj={
        name: req.body.name,
        image: req.body.image,
        description: req.body.desc
    };
    Campground.findByIdAndUpdate(req.params.id,obj,function(err,data){
        if(err)
        console.log(err);
        else
        {
            res.redirect("/campground/"+req.params.id);
        }
    });
});


router.get("/campground/new",isLoggedIn,function(req,res){
    res.render("campground/new.ejs");
});

router.get("/campground/:id",isLoggedIn,function(req,res){
    Campground.findById(req.params.id).populate("comment").exec(function(err,founddata){
        if(err)
        {
            console.log(err);
        }
        else
        {
            //console.log(founddata);
            res.render("campground/show.ejs",{data: founddata});
        }
    });
});

//delete request
router.delete("/campground/:id",ownweship,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/campground");
        else
        res.redirect("/campground");
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

function ownweship(req,res,next)
{
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,function(err,data){
            if(err)
            res.redirect("back");
            else{
                if(data.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.send("you must logged in");
    }
};

module.exports = router;