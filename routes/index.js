const express = require('express');
const router = express.Router();
const User=require('../models/User');

/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Express' });
});

// /register [POST]

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

		const user = new User({
			username,         //ES6 YAPISI destructing -->username=username demek.
			password
		});

		const promise = user.save();
		promise.then((data) => {
			res.json(data)
		}).catch((err) => {
			res.json(err);
		})
	
});

module.exports = router;
