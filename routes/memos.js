const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load model
require('../models/Memo');
const Memo = mongoose.model('memos')

// Memo Index Page
router.get('/', ensureAuthenticated, (req, res) => {
	Memo.find({user: req.user.id})
		.sort({date:'desc'})
		.then(memos => {
			res.render('memos/index', {
				memos: memos
			});
		})
});

// Add Memo Form
router.get('/add', ensureAuthenticated, function(req, res) {
	res.render('memos/add');
});
// Edit Memo Form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
	Memo.findOne({
		_id: req.params.id
	}).then(memo => {
		if (memo.user != req.user.id) {
			req.flash('error_msg', 'Not Athourized');
			res.redirect('/memos');
		}
		else {
			res.render('memos/edit', {
				memo: memo
			});
		}
	});
});

// Proccess form
router.post('/', ensureAuthenticated, function(req, res) {
	let errors = [];

	if(!req.body.title) {
		errors.push({text:'Please add a title'});
	}
	if(!req.body.details) {
		errors.push({text:'Please add some details'});
	}

	if (errors.length > 0) {
		res.render('memos/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	}
	else {
		const newUser = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		}
		new Memo(newUser).save()
			.then(memo => {
				req.flash('success_msg', 'memo added')
				res.redirect('/memos')
			});
	}
});

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
	Memo.findOne({
		_id: req.params.id
	}).then(memo => {
		memo.title = req.body.title;
		memo.details = req.body.details;

		memo.save().then(memo => {
			req.flash('success_msg', 'memo updated')
			res.redirect('/memos');
		});
	});
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
	Memo.remove({
		_id: req.params.id
	}).then(() => {
		req.flash('success_msg', 'memo removed');
		res.redirect('/memos');
	})
});

module.exports = router;