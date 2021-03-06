var mongoose = require('mongoose');
var Reserva = require('../../models/reserva');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');


describe('Testing Usarios ', function() {
    beforeEach(function(done){
        var mongoDB = "mongodb://localhost/testdb";
        mongoose.connect(mongoDB, { useNewUrlParser:true });
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

    describe('Usuario.reservar', () => {
        it('Debe existir la reserva', (done) => {      
            const usuario = new Usuario({ nombre: 'Andres' });
            usuario.save();
            console.log(' usuario ' + usuario);
            const bicicleta = new Bicicleta({ code: 1, color: "rojo", modelo: "urbana" });
            bicicleta.save();
            console.log('bicicleta ' + bicicleta);
            var hoy = new Date();
            var manana = new Date();
            manana.setDate(hoy.getDate() + 1);
            usuario.reservar(bicicleta.id, hoy, manana, ( err, reserva ) => {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas) {
                    console.log(reservas[0]);
                    console.log(reservas[0].usuario);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });
        });
    }); 
});