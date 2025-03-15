const express = require('express');
const { crearUsuario, autenticarUsuario } = require('../controllers/usuarios.controller');
const router = express.Router();

router.post('/register', crearUsuario);
router.post('/login', autenticarUsuario);

module.exports = router;
