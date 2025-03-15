const autenticarUsuario = async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await Usuario.findOne({ username });
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }
        req.session.user = usuario;
        res.redirect('/planificacion'); // Redirige al área principal
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};
