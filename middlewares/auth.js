const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/usuarios/login'); // Redirige al login si no está autenticado
};

module.exports = isAuthenticated;
