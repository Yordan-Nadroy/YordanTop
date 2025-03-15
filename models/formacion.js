const mongoose = require('mongoose');

const FormacionSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    curso: { type: String, required: true },
    fecha: { type: Date, required: true },
});

module.exports = mongoose.model('Formacion', FormacionSchema);
