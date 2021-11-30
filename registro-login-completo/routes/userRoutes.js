const express = require('express');
const router = express.Router();

// Controller
const usersController = require('../controllers/userController');

// Middlewares
const uploadFile = require('../middlewares/multerMiddleware');
const validations = require('../middlewares/validateRegisterMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
//guestMiddlewar= si tengo alguien en session non me deja entrar a registro y login

const authMiddleware = require('../middlewares/authMiddleware');
//si no tengo a nadie en session lo redirigue a login

// Formulario de registro
router.get('/register', guestMiddleware, usersController.register);

// Procesar el registro
router.post('/register', uploadFile.single('avatar'), validations, usersController.processRegister);

// Formulario de login
router.get('/login', guestMiddleware, usersController.login);

// Procesar el login
router.post('/login', usersController.loginProcess);

// Perfil de Usuario
router.get('/profile/', authMiddleware, usersController.profile);
//no me muestra el perfil a menos que este logueado

// Logout // este cierra la session
router.get('/logout/', usersController.logout);


module.exports = router;