const validarCampos = (req, res, next) => {
    const errores = [];
    if (!req.body.username) errores.push('El campo "username" es obligatorio.');
    if (!req.body.password) errores.push('El campo "password" es obligatorio.');
    if (errores.length) {
        return res.status(400).json({ errores });
    }
    next();
};

module.exports = validarCampos;
