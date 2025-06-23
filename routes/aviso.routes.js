const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aviso.controller');

router.get('/', ctrl.obtenerAvisos);
router.get('/:id', ctrl.obtenerAvisoPorId);
router.post('/', ctrl.crearAviso);
router.delete('/:id', ctrl.eliminarAviso);

module.exports = router;
