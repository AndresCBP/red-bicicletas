var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

describe('Testing Api Bicicletas ', function() {
    beforeEach(function(done){
        var mongoDB = "mongodb://localhost/testapi";
        mongoose.connect(mongoDB, { useNewUrlParser:true, useUnifiedTopology: true  });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('Conectado a la base de datos');
            done();
        });
    });

    afterEach(function(done){
        Bicicleta.deleteMany({}, function( err, success ){
            if (err) console.log(err);
            done();
        });
    });

    describe('GET Bicicletas /', () => {
        it('Status 200', (done) => {
            Bicicleta.allBicis(( err, bicis ) => {
                expect(bicis.length).toBe(0);
            });
            var aBici = new Bicicleta({code:1, color:"verde", modelo:"urbana"});
            Bicicleta.add(aBici, ( err, newBici) => {
                if (err) console.log(err);
            });
            request.get('http://localhost:3000/api/bicicletas', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe('POST Bicicletas /create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"code":1, "color":"morado", "modelo":"urbano", "lat":"-54.3", "lng":"-10.4"}';
            request.post({
                headers : headers,
                url : 'http://localhost:3000/api/bicicletas/create',
                body : aBici
            },
            function(error, response, body) {
                expect(response.statusCode).toBe(200);
                Bicicleta.findByCode(1, ( err, bicicleta) => {
                    if ( err) console.log(err);
                    expect(bicicleta.code).toBe(1);
                    done();
                }); 
            });
        });
    });

    describe('UPDATE Bicicletas /update', () => {
        it('Actualizar una bicicleta', (done) => {
            var aBici = new Bicicleta({code:1, color:"verde", modelo:"urbana"});
            aBici.save(( err, bici ) => {
                if (err) console.log(err);
                Bicicleta.findOne({_id:bici._id}, 'code color  modelo').exec(( err, bicicleta) => {
                    if ( err ) console.log( err );     
                    console.log(bicicleta);  
                    var headers = {'content-type' : 'application/json'};
                    var abiciUpdate = '{ "code":1,"color":"rojo","modelo":"urbano","lat": "-54","lng": "-30" }';
                    console.log(bicicleta);
                    request.post({
                        headers : headers,
                        url : 'http://localhost:3000/api/bicicletas/update',
                        body : abiciUpdate    
                    },
                    function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        Bicicleta.findByCode(1, ( err, bicicleta) => {
                            if ( err) console.log(err);
                            expect(bicicleta.code).toBe(1);
                            done();
                        });
                    });
                });
            });
        });
    });        
});