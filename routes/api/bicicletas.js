var express = require('express');
var router = express.Router();
var bicicletaApiController = require('../../controllers/api/bicicletaControllerAPI');

router.get('/', bicicletaApiController.bicicleta_list);
router.post('/create', bicicletaApiController.bicicleta_create);
router.delete('/:id/delete', bicicletaApiController.bicicleta_delete);
router.post('/:id/update', bicicletaApiController.bicicleta_update);

module.exports = router;