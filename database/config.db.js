require('dotenv').config();
const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conexión a MongoDB Atlas exitosa');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1); // Termina si hay un error en la conexión
    }
};

module.exports = conectarDB;
