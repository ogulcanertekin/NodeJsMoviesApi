const express = require('express');
const router = express.Router();

//models

const Movie = require('../models/Movie')

//Date-between Films List--> /api/movies/year1/year2

//gte-->higher or equal operator // gt -->higher operator
//lte-->lower or equal operator // lt -->lower operator

router.get('/between/:start_year/:end_year',(req,res)=>{    //http://localhost:3000/api/movies/between/1965/1972

  const{start_year,end_year}=req.params;

  const promise = Movie.find({
    year:{"$gte":parseInt(start_year),"$lte":parseInt(end_year)}
  });

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});

//TOP10

router.get('/top10',(req,res)=>{    //id olarak algılamaması için -->ikisi de get methodu oldugundan diger get methodunun üzerine yazıldıgında onu ezer. 

  const promise = Movie.find({}).limit(10).sort({imdb_score:-1});

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});



//Delete-->

router.delete('/:movie_id',(req,res,next)=>{ // --> :movie_id  basına 2 nokta koyuyoruz ve --> req.params obj içerisinde movie_id :"url yazılan degeri" tutuyor. 

  const promise = Movie.findByIdAndRemove(req.params.movie_id,req.body); //req.params nesnesi --> {movie_id:url girilen deger}
                                                                         //1. parametre movie id 2. parametre put edilen degerler.

  promise.then((movie)=>{ //herhangi bir data dönecek parametreye istedigimiz ismi verebiliriz.
    if(!movie)            //movie bulunamazsa
      next({message:'The movie was not found',code: 99}); //Hata yakalama app.js error handling methoduna next ile gidiyor.
    
    res.json({status:"OK"}); 
  }).catch((err)=>{
    res.json(err);
  });

});



//Update ---> Postman --> body -->istenilen degerler verilerek güncelleme yapma.Yalnızca bir veriyi güncellemek istersem o da güncellenir.

router.put('/:movie_id',(req,res,next)=>{ // --> :movie_id  basına 2 nokta koyuyoruz ve --> req.params obj içerisinde movie_id :"url yazılan degeri" tutuyor. 

  const promise = Movie.findByIdAndUpdate(req.params.movie_id,req.body,{new:true}); //req.params nesnesi --> {movie_id:url girilen deger} new: true-->datayı dönerken eski data degil update edilmiş datanın dönmesi için.
                                                                         //1. parametre movie id 2. parametre put edilen degerler.

  promise.then((movie)=>{ //herhangi bir data dönecek parametreye istedigimiz ismi verebiliriz.
    if(!movie)            //movie bulunamazsa
      next({message:'The movie was not found',code: 99}); //Hata yakalama app.js error handling methoduna next ile gidiyor.
    
    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });

});





// http://localhost:3000/api/movies/5c7db5335b06902a9ce2daf6 -->Id bazlı tekil movie-detail
router.get('/:movie_id',(req,res,next)=>{ // --> :movie_id  basına 2 nokta koyuyoruz ve --> req.params obj içerisinde movie_id :"url yazılan degeri" tutuyor. 

  const promise = Movie.findById(req.params.movie_id); //req.params nesnesi --> {movie_id:url girilen deger}

  promise.then((movie)=>{ //herhangi bir data dönecek parametreye istedigimiz ismi verebiliriz.
    if(!movie)            //movie bulunamazsa
      next({message:'The movie was not found',code: 99}); //Hata yakalama app.js error handling methoduna next ile gidiyor.
    
    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });

});

//ALL FILMS with directors -->/api/movies

router.get('/',(req,res)=>{         

  const promise = Movie.aggregate([
    {
      $lookup: {
        from:'directors',
        localField:'director_id',
        foreignField:'_id',
        as:'director'
      }
    },
    {
      $unwind:'$director'
    }
  ]);

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});

//Post-Movie
router.post('/', (req, res, next)=> {     //POSTMANDAN ATTRIBUTELERI AYNI BELIRLEYEREK BIR DATA POST EDIYORUZ.Ve veritabanına kaydetmeye calısıyoruz.

  /*-------- Promise - Temiz kodlama --- db.js içerisinde promise tanımlamasını yaptıktan sonra; */

  const movie=new Movie(req.body);

  const promise = movie.save();

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

  /*
  const {title, imdb_score, category, country, year}=req.body; //post edilen datayı req.body ile alabiliyorum.ES6 ile gelen bu yapıyla eşleştirerek değer atama yapabiliyorum.(Destructing)
    
  const movie=new Movie({  //yeni bir movie schema objesi olusturarak posttan gelen verileri icerisine atıyoruz.
    title:title,
    imdb_score:imdb_score,
    category:category,
    country:country,
    year:year
  });

  */

  //Data üzerinde herhangi bir değişiklik yapmayacagım zaman --> Asagıdaki yapıyı kullanabilirim

  /*const movie = new Movie(req.body);

  movie.save((err,data)=>{
    if (err)
      res.json(err);

      res.json(data);
  })
  */

});

module.exports = router;
