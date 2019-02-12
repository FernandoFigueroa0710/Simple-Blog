const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/simpleblog');

router.get('/add', (req, res, next) => {
  res.render('addcategory',{
    'title': 'Add Category',
	});
});

router.post('/add', (req, res, next) => {
  // Get Form Values
  const name = req.body.name;

  	// Form Validation
	req.checkBody('name','Name field is required').notEmpty();

	// Check Errors
	const errors = req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors": errors
		});
	} else {
		const categories = db.get('categories');
		categories.insert({
			name: name,

		}, (err, post) => {
			if(err){
				res.send(err);
			} else {
				req.flash('success','Category Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;
