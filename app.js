const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const memos = require('./routes/memos');
const users = require('./routes/users')

// Passport Config
require('./config/passport')(passport);

// Connect to mongoose
const db = require('./config/database');
mongoose.connect(db.mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//Module Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
	secret: 'ryanisthebest',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// GLOBALS
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Index route
app.get("/", function(req, res) {
	const title = 'expressMemos';

	res.render('index', {
		title: title
	});
});

app.get("/about", function(req, res) {
	res.render("about");
});

// Use routes
app.use('/memos', memos);
app.use('/users', users);

const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log(`Server started on port ${port}`);
});