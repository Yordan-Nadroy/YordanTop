const Formacion = require('../models/formacion');

const crearFormacion = async (req, res) => {
    try {
        const { nombre, correo, curso, fecha } = req.body;
        const nuevaFormacion = new Formacion({ nombre, correo, curso, fecha });
        await nuevaFormacion.save();
        res.redirect('/formacion');
    } catch (error) {
        console.error('Error al crear formación:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const obtenerFormaciones = async (req, res) => {
    try {
        const formaciones = await Formacion.find();
        res.render('formacion', { title: 'Formaciones', formaciones });
    } catch (error) {
        console.error('Error al obtener formaciones:', error);
        res.status(500).send('Error interno del servidor');
    }
};
const obtenerSeguimiento = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.render('seguimiento', { title: 'Seguimiento', usuarios });
    } catch (error) {
        console.error('Error al obtener datos de seguimiento:', error);
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = { obtenerSeguimiento };


module.exports = { crearFormacion, obtenerFormaciones ,obtenerSeguimiento };
