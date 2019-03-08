// npm install mocha chai chai-http --save-dev
// çalıştırmak için -->npm install --global mocha  
//cmd --> mocha // package.jsona script ekledikten sonra -npm test(npm run test.)
//"test" : "mocha --exit --recursive  --timeout 10000" -->package.json test scripti

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();           //should yapısını tanımlıyoruz.

const server = require('../../app.js');

chai.use(chaiHttp);                     //chai http plugini kullanmak için.

// --> önce api/movies altındaki tüm işlemler için /authenticate [POST] ile token alınmalı . ----//

describe('/api/movies TESTS',()=>{      //tüm api/movies altındaki testler için describe ve before ile token alıması.
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

    //---- api/movies [POST] için test

    describe('/POST movie', () => {
		it('it should POST a movie', (done) => {
			const movie = {
				title: 'The Lord of the Rings:The Two Towers',
				director_id: '5c7f3533f401a512dcea4022',
				category: 'Adventure',
				country: 'USA',
				year: 2002,
				imdb_score: 8.7
			};

			chai.request(server)
				.post('/api/movies')
				.send(movie)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('director_id');
					res.body.should.have.property('category');
					res.body.should.have.property('country');
					res.body.should.have.property('year');
					res.body.should.have.property('imdb_score');
					done();
				});
		});
	});
});