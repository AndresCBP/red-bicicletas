var mongoose = require('mongoose');
var Usuario = require('../../models/usuario');
var Bicicleta = require('../../models/bicicleta');
var Reserva = require('../../models/reserva');
var request = require('request');
var server = require('../../bin/www');

describe('Testing Api Usuarios ', function() {
    beforeEach(function(done){
        var mongoDB = "mongodb://localhost/testapi";
        mongoose.connect(mongoDB, { useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true, });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function(){
            console.log('Conectado a la base de datos');
            done();
        });
    });

    afterEach(function(done){
        Reserva.deleteMany({}, function(err, success) {
            if (err) console.log(err);
            Usuario.deleteMany({}, function( err, success ){
                if (err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success)  {
                    if (err) console.log(err);
                    done();
                });
            });
        });
    });

    describe('POST Usuarios /create', () => {
        it('Status 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aUser = '{"nombre":"Andres Bautista"}';
            request.post({
                headers : headers,
                url : 'http://localhost:3000/api/usuarios/create',
                body : aUser
            },
            function(error, response, body) {
                expect(response.statusCode).toBe(200);
                Usuario.find({ "nombre":"Andres Bautista" }, ( err, usuario) => {
                    if ( err) console.log(err);
                    expect(usuario[0].nombre).toEqual('Andres Bautista');
                    done();
                });              
            });   
        });
    });

    describe('Reservas /reservar', () => {
        it('Devuelve la información de la reserva', (done) => {
            let usuario = new Usuario({"nombre": "Andres Bautista"});
            usuario.save();
            let bicicleta = new Bicicleta({"code": 1, "color":"rojo","modelo":"urbano"});
            bicicleta.save();
            var headers = {'content-type' : 'application/json'};
            let aReserva = {
                desde: "2020-08-11",
                hasta: "2020-08-13",
                id: usuario._id,
                bici_id: bicicleta._id
            };

            request.post({
                headers : headers,
                url : 'http://localhost:3000/api/usuarios/reservar',
                body : JSON.stringify(aReserva)
            },
            function(error, response, body) {
                expect(response.statusCode).toBe(200);
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas) {
                    if ( err) console.log(err);
                    done();
                });
                
            });
        
        });
    });

    describe('UPDATE Usuarios /update', () => {
        it('Actualizar un usuario', (done) => {
            var aUser = new Usuario({nombre:"Andres"});
            aUser.save( function(err, user) {
                if( err ) console.log( err );
                Usuario.findById(user._id, function(err, usuario){
                    if( err ) console.log(err);
                    var aUser = {
                        _id: usuario._id,
                        nombre: "Camilo Bautista"
                    };
                    var headers = {'content-type' : 'application/json'};
                    var auserUpdate = JSON.stringify(aUser);
                    request.post({
                        headers : headers,
                        url : 'http://localhost:3000/api/usuarios/update',
                        body : auserUpdate
                    },
                    function(error, response, body) {
                        console.log(response.statusMessage);
                        console.log(error);
                        expect(response.statusCode).toBe(200);
                        Usuario.findById(usuario._id, ( err, usuario) => {
                            if ( err) console.log(err);
                            expect(usuario.nombre).toBe("Camilo Bautista");
                            done();
                        });
                    });
                });
            });        
        });
    });
});