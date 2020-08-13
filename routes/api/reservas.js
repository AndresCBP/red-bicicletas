var express = require('express');
var router = express.Router();
var reservaController = require('../../controllers/api/reservaControllerAPI');

router.get('/', reservaController.reserva_list);
router.post('/update', reservaController.actualizar_reserva);

module.exports = router;