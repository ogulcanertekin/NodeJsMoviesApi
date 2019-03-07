// npm install mocha chai chai-http --save-dev
// çalıştırmak için -->npm install --global mocha  
//cmd --> mocha // package.jsona script ekledikten sonra -npm test(npm run test.)
//"test" : "mocha --exit --recursive  --timeout 10000" -->package.json test scripti

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();           //should yapısını tanımlıyoruz.

const server = require('../../app.js');

chai.use(chaiHttp);                     //chai http plugini kullanmak için.

// api/movies [GET] için test --> önce /authenticate [POST] ile token alınmalı .

describe('/api/movies TESTS',()=>{
    before((done)=>{                    //before ifadesiyle testten önceki işlemlerimi gerçekleştirebiliyorum.Token almak...
        chai.request(server)
            .post('/authenticate')
            .send({username:'ogulcanertekin',password:'123456'})
            .end((err,res)=>{
                token=res.body.token;           //tokeni alıyoruz.ve asagıda get isteginde bulunurken kullanıyoruz.
                //console.log(token);
                done();
            });
    });

    describe('/api/movies [GET] TEST',()=>{             //token alındıktan sonra /api/movies erişmek için test yazıyoruz.
        it('it should Get all the movies',(done)=>{
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token',token)            //header yöntemiyle tokeni post isteğimize dahil ediyoruz.Querystring vb yöntemlerle de yapılabilir..
                .end((err,res)=>{
                    res.should.have.status(200);    //status 200 olmalı.
                    res.body.should.be.a('array');  //dönen data birden fazla movies dönüyor ve array içinde objeler seklinde.Bu yüzden dönen data array olmalı.
                    done();
                });
        })
    });
});