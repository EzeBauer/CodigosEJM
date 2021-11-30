const express = require('express');
const session = require('express-session');
const cookies = require('cookie-parser');//Guarda info del lado del navegador

const app = express();

const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');
//PARA QUE SI AGLUIEN ESTA LOGUEADO, NO ME MUESTRE EN LA BARRA DE NAVEGACION 
// REGISTER Y LOGIN, SINO SU AVATAR Y SU NOMBRE

app.use(session({
	secret: "Shhh, It's a secret",
	resave: false,
	saveUninitialized: false,
}));

app.use(cookies());//Me permite trabajar con req y res con un objeto literal

app.use(userLoggedMiddleware);//este tiene que ir despues de la session, porque 
//se tiene que inicializar  la session antes
app.use(express.urlencoded({ extended: false }));

app.use(express.static('./public'));
app.listen(3001, () => console.log('Servidor levantado en el puerto 3001'));

// Template Engine
app.set('view engine', 'ejs');

// Routers
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', mainRoutes);
app.use('/user', userRoutes);