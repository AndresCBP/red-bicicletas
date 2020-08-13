var mongoose = require('mongoose');
var Usuario = require('../../models/usuario');
var Bicicleta = require('../../models/bicicleta');
var Reserva = require('../../models/reserva');
var request = require('request');
var server = require('../../bin/www');

describe('Testing Api Reservas ', function() {
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
    
    describe('Reservas /update', () => {
        it('Devuelve la información de la reserva', (done) => {         
            let usuario = new Usuario({"nombre": "Andres Bautista"});
            usuario.save();
            let bicicleta = new Bicicleta({"code": 1, "color":"rojo","modelo":"urbano"});
            bicicleta.save();
            const headers = {'content-type' : 'application/json'};
            const reserva = new Reserva ({
                desde: "2020-08-11",
                hasta: "2020-08-13",
                id: usuario._id,
                bici_id: bicicleta._id
            });

            reserva.save( ( err, reserva)=> {
                if(err) console.log(err);
                let updateReserva = {
                    _id: reserva._id,
                    desde: "2020-08-11",
                    hasta: "2020-08-13",
                    usuario: usuario._id,
                    bicicleta: bicicleta._id
                };
                request.post({
                    headers : headers,
                    url : 'http://localhost:3000/api/reservas/update',
                    body : JSON.stringify(updateReserva)
                },
                function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    Reserva.find({_id: reserva._id}).populate('bicicleta').populate('usuario').exec(function(err, reservas) {
                        if ( err) console.log(err);
                        console.log(reservas[0]);
                        done();
                    });
                });
            });
        });
    });
});