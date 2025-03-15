const Usuario = require('../models/usuario');

// Registrar un nuevo usuario
const crearUsuario = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const nuevoUsuario = new Usuario({ username, password, role });
        await nuevoUsuario.save();
        res.status(201).json({ msg: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear usuario', error });
    }
};

// Autenticar usuario
const autenticarUsuario = async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ username });
        if (usuario && usuario.password === password) {
            res.status(200).json({ msg: 'Autenticación exitosa', usuario });
        } else {
            res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error al autenticar usuario', error });
    }
};

module.exports = { crearUsuario, autenticarUsuario };
