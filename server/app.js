const express = require('express');
const conectarDB = require('../database/config.db'); // Conexión a MongoDB
const path = require('path'); // <--- ¡No olvides este import!
const session = require('express-session');
const bodyParser = require('body-parser');
const usuariosRoutes = require('../routes/usuarios.route');
const formacionRoutes = require('../routes/formacion.route');
const { engine } = require('express-handlebars');

const app = express();
const PORT = 3000;

// Conexión a MongoDB
conectarDB();

// Configuraciones
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views')); // Fija correctamente las vistas

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/formacion', formacionRoutes);

app.get('/', (req, res) => {
    res.render('index', { title: 'Inicio' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
