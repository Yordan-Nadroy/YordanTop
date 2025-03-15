const express = require('express');
const { crearFormacion, obtenerFormaciones } = require('../controllers/formacion.controller');
const router = express.Router();

router.post('/', crearFormacion);
router.get('/', obtenerFormaciones);

module.exports = router;
