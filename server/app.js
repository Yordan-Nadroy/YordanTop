const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { engine } = require('express-handlebars'); // Ajuste aquí
const app = express();
const PORT = 3000;

// Configurar Handlebars
app.engine('hbs', engine({ extname: '.hbs' })); // Ajuste aquí
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tu_email@gmail.com',
        pass: 'tu_contraseña'
    }
});

// Función para verificar roles
function verificarRol(role) {
    return function (req, res, next) {
        if (req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.status(403).send('Acceso denegado');
        }
    }
}

app.get('/', (req, res) => {
    res.render('index', { title: 'Inicio' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Inicio de Sesión' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    fs.readFile('usuarios.json', (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;

        const usuarios = data ? JSON.parse(data) : [];
        const usuario = usuarios.find(u => u.username === username);

        if (usuario) {
            bcrypt.compare(password, usuario.password, (err, result) => {
                if (result) {
                    req.session.user = { username, role: usuario.role };
                    res.redirect('/formacion');
                } else {
                    res.send('Usuario o contraseña incorrectos.');
                }
            });
        } else {
            res.send('Usuario o contraseña incorrectos.');
        }
    });
});

app.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        fs.readFile('usuarios.json', (err, data) => {
            if (err && err.code !== 'ENOENT') throw err;

            const usuarios = data ? JSON.parse(data) : [];
            usuarios.push({ username, password: hash, role });

            fs.writeFile('usuarios.json', JSON.stringify(usuarios, null, 2), (err) => {
                if (err) throw err;
                res.send('Usuario registrado exitosamente.');
            });
        });
    });
});

app.get('/formacion', verificarRol('admin'), (req, res) => {
    res.render('formacion', { title: 'Planificación de Formación' });
});

app.get('/seguimiento', verificarRol('admin'), (req, res) => {
    const empleados = [
        { nombre: 'Juan Pérez', curso: 'Curso de Marketing', estado: 'En Progreso', fecha: '2025-04-15', progreso: 70 },
        { nombre: 'María López', curso: 'Curso de Ventas', estado: 'Completado', fecha: '2025-03-01', progreso: 100 },
        // Más empleados...
    ];
    
    const totalCursosEnProgreso = empleados.filter(emp => emp.estado === 'En Progreso').length;
    const totalCursosCompletados = empleados.filter(emp => emp.estado === 'Completado').length;
    const duracionPromedioCursos = 2; // Este valor debe calcularse adecuadamente
    
    res.render('seguimiento', {
        title: 'Seguimiento de Formación',
        empleados,
        totalCursosEnProgreso,
        totalCursosCompletados,
        duracionPromedioCursos
    });
});

app.get('/seguimiento/data', verificarRol('admin'), (req, res) => {
    const empleados = [
        { nombre: 'Juan Pérez', progreso: 70 },
        { nombre: 'María López', progreso: 100 },
        // Más empleados...
    ];

    res.json({ empleados });
});


app.get('/datos', verificarRol('admin'), (req, res) => {
    fs.readFile('datos.json', (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;
        
        const datos = data ? JSON.parse(data) : [];
        res.render('datos', { title: 'Datos de Formación', datos });
    });
});

app.get('/reportes', verificarRol('admin'), (req, res) => {
    fs.readFile('datos.json', (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;
        
        const datos = data ? JSON.parse(data) : [];
        const reporte = generarReporte(datos);
        res.render('reportes', { title: 'Reportes y Estadísticas', reporte });
    });
});

app.post('/planificar', verificarRol('admin'), (req, res) => {
    const { nombre, correo, curso, fecha } = req.body;
    const nuevoDato = { nombre, correo, curso, fecha };
    
    // Leer el archivo JSON existente
    fs.readFile('datos.json', (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;
        
        const datos = data ? JSON.parse(data) : [];
        datos.push(nuevoDato);
        
        // Escribir en el archivo JSON
        fs.writeFile('datos.json', JSON.stringify(datos, null, 2), (err) => {
            if (err) throw err;
            res.send('Datos guardados exitosamente.');

            // Enviar correo electrónico de notificación
            const mailOptions = {
                from: 'tu_email@gmail.com',
                to: correo,
                subject: 'Nueva Sesión de Formación Planificada',
                text: `Hola ${nombre},\n\nSe ha planificado una nueva sesión de formación para el curso "${curso}" en la fecha "${fecha}".\n\nSaludos,\nEquipo de Formación`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                } else {
                    console.log('Correo enviado:', info.response);
                }
            });
        });
    });
});

app.delete('/eliminar/:index', verificarRol('admin'), (req, res) => {
    const index = parseInt(req.params.index, 10);

    // Leer el archivo JSON existente
    fs.readFile('datos.json', (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;
        
        const datos = data ? JSON.parse(data) : [];
        if (index >= 0 && index < datos.length) {
            datos.splice(index, 1);
            
            // Escribir en el archivo JSON
            fs.writeFile('datos.json', JSON.stringify(datos, null, 2), (err) => {
                if (err) throw err;
                res.send('Datos eliminados exitosamente.');
            });
        } else {
            res.status(400).send('Índice inválido.');
        }
    });
});

app.put('/editar/:index', verificarRol('admin'), (req, res) => {
    const index = parseInt(req.params.index, 10);
    const { nombre, correo, curso, fecha } = req.body;

    // Leer el archivo JSON existente
    fs.readFile('datos.json', (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;
        
        const datos = data ? JSON.parse(data) : [];
        if (index >= 0 && index < datos.length) {
            datos[index] = { nombre, correo, curso, fecha };
            
            // Escribir en el archivo JSON
            fs.writeFile('datos.json', JSON.stringify(datos, null, 2), (err) => {
                if (err) throw err;
                res.send('Datos editados exitosamente.');
            });
        } else {
            res.status(400).send('Índice inválido.');
        }
    });
});

function generarReporte(datos) {
    // Implementar la lógica para generar reportes y estadísticas
    const totalEmpleados = datos.length;
    const cursos = {};
    
    datos.forEach(dato => {
        if (!cursos[dato.curso]) {
            cursos[dato.curso] = 0;
        }
        cursos[dato.curso]++;
    });

    return {
        totalEmpleados,
        cursos
    };
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
