var Bicicleta = require('../../models/bicicleta');
var server = require('../../bin/www');
const axios = require('axios').default;

describe('Bicicleta API', () => {
    describe('GET Bicicletas /', () => {
        it('Status 200', (done) => {
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(1, 'rojo', 'urbana', [51.5, -0.09]);
            Bicicleta.add(a);
            axios.get('http://localhost:3000/api/bicicletas')
            .then(function (response) {
                expect(response.status).toBe(200);
                console.log(response.status);
                done();
              })
              .catch(function (error) {
                console.log(error);
              })
              .finally(function () {
                console.log('Get terminado');
              });
            
        });
    });

    describe('POST Bicicletas /create', () => {
        it('Status 200', (done) => {
            axios.post('http://localhost:3000/api/bicicletas/create', {
                id:"10",
                color:"morado",
                modelo:"urbana",
                lat:"-32",
                lng:"-54"
            })
            .then(function (response) {
                expect(response.status).toBe(200);
                console.log(response.status);
                done();
              })
              .catch(function (error) {
                console.log(error);
              })
              .finally(function () {
                console.log('Post create terminado');
              });
            
        });
    });
});
