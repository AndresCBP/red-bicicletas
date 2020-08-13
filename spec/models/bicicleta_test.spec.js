var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', function(){
    beforeEach(function(done) {
        var mongoDB = 'mongodb://localhost/test';
        mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Error de conexion '));
        db.once('open', function() {
            console.log('Conectado a la base de datos test');
            done();
        });
    });

    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err);
            done();
        })
    });

    describe('Bicicleta.createInstance', () => {
        it('Crear una instancia de Bicicleta', () => {
            var bici = Bicicleta.createInstance(1, 'verde', 'urbana', [-34.5, -54.11]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe('verde');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.11);
        })
    });

    describe('Bicicleta.allBicis', () => {
        it('Comienza vacia', (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add', () => {
        it('Agrega solo una bici', (done) => {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici, function(err, newBici){
                if(err) console.log(err);
                Bicicleta.allBicis(function(err, bicis) {
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    done();
                });
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('Debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toEqual(0);
                
                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if(err) console.log(err);

                    var aBici2 = new Bicicleta({code: 2, color: "rojo", modelo: "montaña"});
                    Bicicleta.add(aBici2, function(err, newBici2) {
                        if(err) console.log(err);
                        Bicicleta.findByCode(1, function(error, targetBici) {
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);
                            done();
                        })
                    });
                });
            });
        });
    });
});


/* MODELO ANTIGUO
beforeEach(() => {
    Bicicleta.allBicis = [];
});

describe('Bicicleta.allBicis', () => {
    it('Comienza vacia', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('Agregar bicicleta', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta(1, 'rojo', 'urbana', [51.5, -0.09]);
        Bicicleta.add(a);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findById', () => {
    it('Devolver la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var bici1 = new Bicicleta(1, 'verde', 'urbana', [51.5, -0.09]);
        var bici2 = new Bicicleta(2, 'rojo', 'montaña', [51.5, -0.09]);
        Bicicleta.add(bici1);
        Bicicleta.add(bici2);
        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(bici1.color);
        expect(targetBici.modelo).toBe(bici1.modelo);

    });
});

describe('Bicicleta.removeById', () => {
    it('Eliminar la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var bici1 = new Bicicleta(1, 'verde', 'urbana', [51.5, -0.09]);
        var bici2 = new Bicicleta(2, 'rojo', 'montaña', [51.5, -0.09]);
        Bicicleta.add(bici1);
        Bicicleta.add(bici2);
        Bicicleta.removeById(1);
        expect(Bicicleta.allBicis.length).toBe(1);
    });
});
*/