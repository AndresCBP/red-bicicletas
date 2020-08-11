var Bicicletas = require('../../models/bicicleta');
const Bicicleta = require('../../models/bicicleta');

beforeEach(() => {
    Bicicletas.allBicis = [];
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
        var targetBici = Bicicletas.findById(1);
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