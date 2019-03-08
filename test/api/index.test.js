// npm install mocha chai chai-http --save-dev
// çalıştırmak için -->npm install --global mocha  cmd --> mocha // package.jsona script ekledikten sonra -npm test(npm run test.)
// test de bir hata oldugunda expected  ve actual ile bilgilendirme yapılıyor.


const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();           //should yapısını tanımlıyoruz.

const server = require('../../app.js');

chai.use(chaiHttp);  //chai http plugini kullanmak için.

// / -->index dizini için test

describe('Index Tests',()=>{ // describe kavramı  --> açıklama   it kavramı->Bir describe içinde birden fazla test yazılabilir.
    it('/ GET Index Page',(done)=>{
        chai.request(server)                    //sunucuya get ile ana dizine istekte bulunuyoruz.
            .get('/')
            .end((err,res)=>{
                res.should.have.status(200);    //status 200 olmalı.Test basarılı olması için // çıktıdaki expected statusun 200 olması.200 olmadıgı taktirde mevcut status ile birlikte hatayı yazdıracak.
                done();
            })
    });
});