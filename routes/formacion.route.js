const express = require('express');
const { crearFormacion, obtenerFormaciones } = require('../controllers/formacion.controller');
const router = express.Router();

router.get('/', obtenerFormaciones);
router.post('/', crearFormacion);

module.exports = router;
