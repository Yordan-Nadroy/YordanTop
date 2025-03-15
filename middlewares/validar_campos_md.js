const { check, validationResult } = require('express-validator');

const validarCampos = [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('role', 'El rol debe ser admin o empleado').isIn(['admin', 'empleado']),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validarCampos };
