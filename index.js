const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const auth = require('./middleware/auth');

//server
const App = express();
App.use(auth);

//conectar a la base de datos

conectarDB();

//habilitar cors
const corsOptions = { origin: process.env.FRONTEND_URL};
App.use(cors(corsOptions));

//Habilita express.jon
App.use(express.json({extended: true}));

//habilita una carpeta publica
App.use(express.static('uploads'));

//port
const port = process.env.PORT || 3001;

//rutas

App.use('/api/usuarios', require('./routes/usuarios'));
App.use('/api/auth', require('./routes/auth'));
App.use('/api/enlaces', require('./routes/enlaces'));
App.use('/api/archivos', require('./routes/archivos'));

//start app
App.listen(port,'0.0.0.0',()=>{
    console.log(`Server running in port ${port}`);
});