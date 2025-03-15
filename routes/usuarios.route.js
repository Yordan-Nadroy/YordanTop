const express = require('express');
const { crearUsuario, autenticarUsuario } = require('../controllers/usuarios.controller');
const router = express.Router();

router.get('/register', (req, res) => res.render('register', { title: 'Registrar Usuario' }));
router.post('/register', crearUsuario);

router.get('/login', (req, res) => res.render('login', { title: 'Iniciar Sesión' }));
router.post('/login', autenticarUsuario);

module.exports = router;
