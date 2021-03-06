const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        Campground = require('./models/campground'),
        Comment = require('./models/comment'),
        seedDB = require('./seeds'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        methodOverride = require('method-override'),
        User = require('./models/user'),
        flash = require('connect-flash');

//Requiring Routes

const   commentRoutes = require('./routes/comments'),
        campgroundRoutes = require('./routes/campgrounds'),
        indexRoutes = require('./routes/index');

// Database dev and public        

const db = process.env.MONGODB_URL || 'mongodb://localhost/yelpCamp';
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB(); // seed the database

// PASSPORT Config

app.use(require('express-session')({
    secret: "anything",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Requiring routes
app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serving on port ${ PORT }`);
});