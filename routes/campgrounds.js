var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require('../middleware');

// INDEX - show all campgrounds
router.get('/', function(req,res) {
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array
    // Create a new campground and save to DB
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    req.body.campground.author = author;
    Campground.create(req.body.campground, function(err, newlyCreated) {
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req,res) {
    res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function(req, res) {
    // find campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req,res){
    // is user logged in at all
    Campground.findById(req.params.id, function(err,foundCampground) {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
    
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res){
    // find and update correct campground
    // redirect to show page
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;