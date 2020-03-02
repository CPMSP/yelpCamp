const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// INDEX ROUTE

router.get('/', function (req, res) {  
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
});

// NEW ROUTE

router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

// CREATE ROUTE

router.post('/', middleware.isLoggedIn, function (req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, price: price, image: image, description: desc, author: author}
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

// SHOW ROUTE

router.get('/:id', function (req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// Edit Campground Route

router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// Update Campground Route

router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

// Destroy Campground Route

router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground Removed');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;