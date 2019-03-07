//   /authentication postda oturum açma işleminden sonra token olusturmustuk.Olusturulan bu tokenların
//  routelara erişirken verify edilmesi dogrulanması işlemlerini burada bir middleware tanımlayarak yapıyoruz.
//  Bu modülü export ettikten sonra app.jste app.use('/api',verifyToken) -->diyerek api altındaki tüm routearda bu middleware kullanılarak verify işlemi yapılacagını belirtiyoruz.

const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{

    //tokena erişmek için;
    const token = req.headers['x-access-token'] || req.body.token || req.query.token //localhost:3000/api/movies?token=asdsadasd --->req.query.token  -->tokeni query ile yakalarız.Tokena erişmek için 3 farklı durum var hepsi icin incelememiz gerekiyor.

    if(token){
        jwt.verify(token,req.app.get('api_secret_key'),(err,decoded)=>{     //tokena eriştikten sonra 1. parametreye bu tokeni 2. parametreye config dosyasında olusturdugumuz secret key vererek verify işlemini denetliyoruz.
            if(err){
                res.json({
                    status:false,
                    message:'Failed to authenticate token.'
                })
            }else{
                req.decode = decoded;    //Payload kısmını burda alıyoruz.
                //console.log(decoded);   //Herhangi bir istekte bulundugumuzda username ve token olusturma ve bitme bilgisini görebiliyoruz.
                next();                 //Sorun yok herhangi bir route ile eşleşebilir.
            }
        });
    }else{
        res.json({
            status:false,
            message:'No token provided.'
        })
    }
};


/* 
    Authenticate ile bir token aldıktan sonra --->

 POSTMANDEN GET QUERY --->Aldıgımız bu tokeni //localhost:3000/api/movies?token=olusturulan token
 POSTMAN HEADER --->Content-type= x-access-token value=olusturulan token  -->//localhost:3000/api/movies Get ile ulasmaya calıstıgımızda ulasıyoruz.
 POSTMAN BODY[POST] İŞLEMİ ---> Post datası olarak verilerin yanında bir de token --> olusturulan token degeri girersem veri ekleyebilirim.

 */



