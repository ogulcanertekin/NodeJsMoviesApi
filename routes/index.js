const express = require('express');
const router = express.Router();

//Models
const User=require('../models/User');

// Bcryptjs --> Parola veritabanına şifreli kaydetmek için modul--> npm install bcryptjs --save
const bcrypt = require('bcryptjs');

// /register [POST]

router.post('/register', (req, res, next) => {
	const { username, password } = req.body;
	bcrypt.hash(password,10).then(function(hash){  //bcrypt.hash (password,sifreleme aralıgı)
		const user = new User({
			username,         	//ES6 YAPISI destructing -->username=username demek.
			password:hash  		//hash fonksiyonundan gelen hashlenmis parolayı password atadım.
		});

		const promise = user.save();		//hashlenmis parola ve username veritabanına kaydediyoruz.
		promise.then((data) => {
			res.json(data)
		}).catch((err) => {
			res.json(err);
		})
	});
});


/* GET home page. */
router.get('/', (req, res, next)=> {
	res.render('index', { title: 'Express' });
  });

module.exports = router;
