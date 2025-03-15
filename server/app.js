require('dotenv').config();
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const conectarDB = require('../database/config.db');
const usuariosRoutes = require('../routes/usuarios.route');
const formacionRoutes = require('../routes/formacion.route');

const app = express();

// Conectar a MongoDB
conectarDB();

// Configurar Handlebars
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/formacion', formacionRoutes);

app.get('/', (req, res) => res.render('index', { title: 'Inicio' }));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
