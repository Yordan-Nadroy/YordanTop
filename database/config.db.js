const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://<solizramosyordan>:<LyKvSmibDY05htKV>@cluster0.xxxxx.mongodb.net/<DC_SYSTEM_>?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión a MongoDB Atlas exitosa');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1); // Finaliza la aplicación si hay un error
    }
};

module.exports = conectarDB;
