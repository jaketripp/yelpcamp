var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE
router.get('/', function(req,res) {
    res.render('landing');
});

// SHOW REGISTER FORM
router.get('/register', function(req,res){
    res.render('register');
});
// HANDLE SIGNUP LOGIC
router.post('/register', function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render('register', {'error': err.message});
        }
        passport.authenticate('local')(req,res, function(){
            req.flash('success', 'Welcome to YelpCamp, ' + user.username);
            res.redirect('/campgrounds');
        });
    });
});

// SHOW LOGIN FORM
router.get('/login', function(req,res){
    res.render('login');
});
// HANDLE LOGIN LOGIC
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true
}), function(req,res){
});

// WHAT ABOUT A WEBSITE THAT HAS MORE LAYERS LIKE AN ONION?
// IF I TRIED TO DO SOMETHING DEEP IN THE LAYERS AND I CLICKED SOMETHING AND IT TOOK ME TO LOGIN PAGE
// THEN I LOGGED IN AND IT REDIRECTED TO THE HOME PAGE
// ID BE MADDDDDDD

// LOGOUT ROUTE
router.get('/logout', function(req,res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect('/campgrounds');
});

module.exports = router;