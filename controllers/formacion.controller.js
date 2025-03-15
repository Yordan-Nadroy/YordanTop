const Formacion = require('../models/formacion');

// Crear una nueva formación
const crearFormacion = async (req, res) => {
    const { nombre, correo, curso, fecha } = req.body;
    try {
        const nuevaFormacion = new Formacion({ nombre, correo, curso, fecha });
        await nuevaFormacion.save();
        res.status(201).json({ msg: 'Formación creada exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear formación', error });
    }
};

// Obtener todas las formaciones
const obtenerFormaciones = async (req, res) => {
    try {
        const formaciones = await Formacion.find();
        res.status(200).json(formaciones);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener formaciones', error });
    }
};

module.exports = { crearFormacion, obtenerFormaciones };
