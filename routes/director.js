const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');

const Director = require('../models/Director');

//Director Remove -->api/directors/id [DELETE]

router.delete('/:director_id',(req,res)=>{
		const promise=Director.findByIdAndDelete(req.params.director_id)

		promise.then((data)=>{
			if(!data)
				next({ message :'The director was not found.',code:99}); //app.js te error handlera gider.
	
			res.json({status:'OK'});	
		}).catch((err)=>{
			res.json(err);
		})
});

//Director Update -->api/directors/id [PUT]

router.put('/:director_id',(req,res)=>{
	const promise=Director.findByIdAndUpdate(
		req.params.director_id,
		req.body,		//req.body gönderilen update.
		{
			new:true //response dönerken update edilmis hali dönsün.
		}
	);

	promise.then((data)=>{
		if(!data)
			next({ message :'The director was not found.',code:99}); //app.js te error handlera gider.

		res.json(data);	
	}).catch((err)=>{
		res.json(err);
	})
});



//Director Detail -->api/directors/id -->Match operatoru kullanılmalı

router.get('/:director_id', (req, res) => {
	const promise = Director.aggregate([
		{
			$match:{
				'_id':mongoose.Types.ObjectId(req.params.director_id)
			}
		},
		{
			$lookup: {                      //eşleştirme-Join işlemini yapıyoruz.
				from: 'movies',             //movies tablosu ile join 
				localField: '_id',          //bu tablodaki id yi
				foreignField: 'director_id', //movies director id ile bagla.
				as: 'movies'                 //movie leri movies degiskeni arrayinin icine at.
			}
        }/*,
		{
			$unwind: {
				path: '$movies',        //path ile movies degiskenine movie datalarını atıyoruz.
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$group: {               // 1den fazla filmi olanlar listenirken aynı director objesi tekrar edip filmler farklı gösteriliyor.Bunun tek bir director objesi altında gösterilmesi için grouplama yapılmalı.
				_id: {              //bir field vermemiz gerekiyor.
					_id: '$_id',
					name: '$name',
					surname: '$surname',
					bio: '$bio'
				},
				movies: {
					$push: '$movies'        //unwind de yakaladıgımız movieleri buraya atıyoruz.
				}
			}
		},
		{
			$project: {             // gruplama yaparken mecburen kullandıgımız director objesinin basındaki _id degiskenini kaldırmak için;
				_id: '$_id._id',     //tüm projedeki degerleri yeniden olusturuyorum ve _id 'yi yukardaki grouplama işlemindeki; _id._id ile alarak director idsine yeniden atıyoruz.
				name: '$_id.name',
				surname: '$_id.surname',
				movies: '$movies'
			}
		}*/
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	});
});

//api/directors -->directors with films

//bu yapıyı kurmak icin aggregate ile join işlemi yapılmalı.Unwindsiz de aslında aynı cıktıyı üretiyor?

router.get('/', (req, res) => {
	const promise = Director.aggregate([
		{
			$lookup: {                      //eşleştirme-Join işlemini yapıyoruz.
				from: 'movies',             //movies tablosu ile join 
				localField: '_id',          //bu tablodaki id yi
				foreignField: 'director_id', //movies director id ile bagla.
				as: 'movies'                 //movie leri movies degiskeni arrayinin icine at.
			}
        }/*,
		{
			$unwind: {
				path: '$movies',        //path ile movies degiskenine movie datalarını atıyoruz.
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$group: {               // 1den fazla filmi olanlar listenirken aynı director objesi tekrar edip filmler farklı gösteriliyor.Bunun tek bir director objesi altında gösterilmesi için grouplama yapılmalı.
				_id: {              //bir field vermemiz gerekiyor.
					_id: '$_id',
					name: '$name',
					surname: '$surname',
					bio: '$bio'
				},
				movies: {
					$push: '$movies'        //unwind de yakaladıgımız movieleri buraya atıyoruz.
				}
			}
		},
		{
			$project: {             // gruplama yaparken mecburen kullandıgımız director objesinin basındaki _id degiskenini kaldırmak için;
				_id: '$_id._id',     //tüm projedeki degerleri yeniden olusturuyorum ve _id 'yi yukardaki grouplama işlemindeki; _id._id ile alarak director idsine yeniden atıyoruz.
				name: '$_id.name',
				surname: '$_id.surname',
				movies: '$movies'
			}
		}*/
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	});
});


router.post('/',(req,res,next)=>{

    const director= new Director(req.body);
    const promise=director.save();

    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    })

});

module.exports = router;