const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://solizramosyordan:LyKvSmibDY05htKV@cluster0.xxxxx.mongodb.net/db_system?retryWrites=true&w=majority');
        console.log('Conexión a MongoDB Atlas exitosa');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1);
    }
};

module.exports = conectarDB;
