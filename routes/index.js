const express = require('express');
const router = express.Router();

//Models
const User=require('../models/User');

// Bcryptjs --> Parola veritabanına şifreli kaydetmek için modul--> npm install bcryptjs --save
const bcrypt = require('bcryptjs');

//Jwt -->

const jwt = require('jsonwebtoken');  //npm install jsonwebtoken --save


router.post('/authenticate',(req,res)=>{

	const {username,password}=req.body;

	User.findOne({
		username :username 		//post edilen username i veritabanında ara		
	},(err,user)=>{
		if(err)
			throw err;

		if(!user){				//username veritbanında yoksa 
			res.json({
				status:false,
				message:'Authentication failed, user not found.'
			});
		}else{					//username veritabanında bulunursa

			bcrypt.compare(password,user.password).then((result)=>{	    //bcrypt compare methoduyla post edilen parola ile veritabanında aradıgım usernamee karsılık gelen parolayı karsılastır, true veya false üret.Otomatik hash fonks ile veritabanındaki parolayı normal haline çeviriyor.
				if(!result){		//parolalar eşleşmediyse false dönerse;
					res.json({
						status:false,
						message:'Authentication failed, password does not match.'
					});
				}else{				//parolalar eşleşirse bir token olusturulacak.Oturum.
					const payload = {	//taşımak istedigim veri.
						username:username
					};
					const token =jwt.sign(payload,req.app.get('api_secret_key'),{		//1. parametre payload-2. parametre config.jste olusturup export ettikten sonra app.jste app.set ile global olarak kullanıma açtıgım ifade-3. parametre ise oturum süresi vb konfigurasyonlar.
						expiresIn:720 //12 hour
					});

					res.json({		//son olarak oturum açma işlemi basarılı oldugunda response olarak tokeni yazdıralım.
						status:true,
						token:token		//Son olarak bu tokeni requeste eklememiz gerekiyor.Bundan sonraki erişim isteklerinde bu tokeni kullanabilmek ve token verify edilirse api a erişmek için.
					})
				}
			});
		}	
	});

});

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
