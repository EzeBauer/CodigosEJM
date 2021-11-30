/*=====================================================================
=======================================================================
                               SESSION:
             objeto literal que vive en el req(res.session)
========================================================================
======================================================================= */

/* 1- Instalamos desde al terminal */
npm i express-session

/* 2- EN EL APP.JS LO REQUERIMOS */
const session = require('express-session');


/* Lo configuramos como middleware a nivel aplicacion
Ejecutamos session()pasandole como argumento un objeto literal 
con la propiedad secret con un texto unico que servira para indentificar
a nuestro sitio web */

app.use(session({
	secret: "Nombre del sitio",
	resave: false,
	saveUninitialized: false,
}));


/* Al momento de definir y almacernar informacion , llamamos a la propiedad
session del objeto request */
req.session.colorFondo = 'violeta'; /* defino y guardo una info */

/* Al momento de utilizar esa info(leerla), la llamo de la siguiente manera */
let colorFondo = req.session.colorFondo;

/*=====================================================================
=======================================================================
   EJEMPLO DE SESSION
========================================================================
======================================================================= */

//EN EL METODO DE USERCONTROLLERS

loginProcess: (req, res) => {
    let userToLogin = User.findByField("email", req.body.email);
    //busco por el email que me ingreso al usuario en la DB

    if (userToLogin) {
      //si tengo el usuario con el email ingresado

        let isOkThePassword = bcryptjs.compareSync(
        req.body.password,
        userToLogin.password
      );

    
      if (isOkThePassword) {
        // SI HAN COINCIDIDO LAS CONTRASEñAS
        delete userToLogin.password; //borramos la propiedad password por seguridad

		/* ======================SESSION======================== */
        req.session.userLogged = userToLogin;
        //en session creo una propiedad (userLogged) que me guarda TODA la info 
        //del usuario logueado (MENOS EL PASSWORD QUE BORRE ARRIBA)

    /* EN EL METODO 'PROFILE' LE PASO EL USERLOGGED*/
    profile: (req, res) => {
		return res.render('userProfile', {
			user: req.session.userLogged //em la vista le paso la variable user que
			//tiene la informacion de usuario logueado "userLogged" (todo menos la contraseña)
		});
	},
/*=====================================================================
=======================================================================
   CUEDO IMPRIMIR LA INFO GUARDADA EN LA VARIABLE "USER" EN LA VISTA
   "PERFIL"
========================================================================
======================================================================= */

    <!DOCTYPE html>
<html lang="es">
<%- include('partials/head'); %>
<body>
	<%- include('partials/navbar'); %>
	
	<!-- Container -->
	<div class="container" style="margin-top: 40px;">
		<div class="row">
			<div class="col-md-3">
				<h2>Hi <%= user.fullName %> </h2>
				<img src="/images/avatars/<%= user.avatar %> ">
				<br>
				<br>
				<div class="alert alert-success"><%= user.email %> </div>
			</div>
		</div>
	</div>
	<!-- //Container -->
	
	<%- include('partials/footer'); %>
</body>
</html>
/*=====================================================================
=======================================================================
  METODO PARA DESLOGUEARSE
========================================================================
=======================================================================*/

logout: (req, res) => {
		res.clearCookie('userEmail');//clearCookie elimina la cookie que yo le indique
		req.session.destroy();//Borro todo lo que tengo en session(usuario logueado)
		return res.redirect('/');
	}
}
{/* 
PASO EL METODO A LA RUTA LOGOUT */}
// Logout // este cierra la session
router.get('/logout/', usersController.logout);




{/* PARA PODER VER LA VISTA PERFIL SOLO CUANDO ESTE logueado */}
{/* 
CREO EL MIDDLEWARE GUESTMIDDLEWARE */}

function guestMiddleware(req, res, next) {
	if (req.session.userLogged) { //Si tengo a alguien en session (logeado)
		return res.redirect('/user/profile'); //lo dirijo a la vista de su perfil
	} //SI NO ESTA LOGUEADO NO LE PERMITE ENTRAR A PERFIL
	next();//si no hay nadie en session que siga con el controlador
}

module.exports = guestMiddleware;

/* PASO EL MIDDLEWARE AL ARCHIVO DE RUTA USERROUTES.JS */

const guestMiddleware = require('../middlewares/guestMiddleware');
// Formulario de registro
router.get('/register', guestMiddleware, usersController.register);

// Formulario de login
router.get('/login', guestMiddleware, usersController.login);

/* CREO EL AUTHMIDDLEWARE */

function authMiddleware(req, res, next) {
	if (!req.session.userLogged) {//si no tengo a nadie en session
		return res.redirect('/user/login');//lo redirijo a login
	}
	next();// si tengo a alguien, que siga la peticion
}

module.exports = authMiddleware;

/* LO PASO EN LA RUTA CORRESPONDIENTE */
// Perfil de Usuario
router.get('/profile/', authMiddleware, usersController.profile);
//no me muestra el perfil a menos que este logueado

/*=====================================================================
=======================================================================
CREO EL METODO PARA QUE, SI ESTOY LOGUEADO, ME PERMITA VER EN LAS VISTAS
CIERTAS COSAS, SI NO NO
========================================================================
=======================================================================*/


const User = require('../models/User');

//PROPOSITO: PREGUNTAR SI TENGO A ALGUIEN EN SESSION

function userLoggedMiddleware(req, res, next) {
  res.locals.isLogged = false; //Variable "isLoggged" que puedo pasar en todas las vistas
  //Esta por defecto en false (cuando no tengo a nadie en session, pasara a session cuando
  //</div>tenga a alguien logueado)

  if (req.session.userLogged) {
    //Si tengo a alguien logueado en session

    res.locals.isLogged = true; //para mostrar en la navbar nombre y avatar del usuario
	//logueado en lugar del register y login
    res.locals.userLogged = req.session.userLogged; // Estoy pasando lo que tengo en session
    //a una variable local que pueda ser compartida con todas las vistas (en este caso "userLogged")
  }

  next();
}

module.exports = userLoggedMiddleware;

/*=====================================================================
=======================================================================
COMO EN LOCALS TENGO A TODO MI USUARIO EN SESSION
PASO ESTO A LA VISTA DEL HEADER (NAV-BAR)
========================================================================
=======================================================================*/
      
<ul class="navbar-nav align-items-center">
				<% if (locals.isLogged) { %> 
					<!-- COMO ESTA SETEADO EN FALSE EN EL MIDDLEWARE userLogged ME VA A MOSTRAR ESTO -->
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" id="dropUser" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							<img src="/images/avatars/<%= locals.userLogged.avatar %>" width="40" style="border-radius: 100%;">
							Hi <%= locals.userLogged.name %> 
						</a>
						<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
							<a class="dropdown-item" href="/user/profile">My profile</a>
							<li><hr class="dropdown-divider"></li>
							<a class="dropdown-item" href="/user/logout">Logout</a>
						</ul>
					</li>
				<% } else { %> <!-- CUANDO HAYA UN USUARIO LOGUEADO ME MUESTRA ESTO -->
					<li class="nav-item"><a class="nav-link" href="/user/register">Register</a></li>
					<li class="nav-item"><a class="nav-link" href="/user/login">Login</a></li>
				<% } %>
			</ul>




/* ========================================================================
=======================================================================
                       cookies
========================================================================
======================================================================= */

/* 1- INSTALO EL MODULO (SI INICIE CON EXPRESS-GENERATOR YA VIENE INSTALADO) */

npm i cookie-parser 

/* 2- En app.js  */

const cookies = require('cookie-parser');//Guarda info en el navegador del usuario


app.use(cookies());//Me permite trabajar con req y res con un objeto literal

/* 3- Para definir una cookie */

res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 2 })
/* Creo la cookie: como parametros van 1- el nombre que le asigno(en este caso "userEmail" )
2- La informacion que guardo alli (es este ejemplo, el email escrito por el usuario) y 
3- Un objeto literal con la propiedad "maxAge"indicandole el tiempo de vida de la cookie en milisegundos */



/* 3- Para leer una cookie previamente guardada*/

req.cookies.userEmail // cuando leermos una cookie es "cookies" con "s"

/* ========================================================================
=======================================================================
                       EJEMPLO DE COOKIES
========================================================================
======================================================================= */</li>

loginProcess: (req, res) => {
   
	
        req.session.userLogged = userToLogin;
        //en session creo una propiedad (userLogged) que me guarda la info del usuario logueado

        if (req.body.remember_user) {
          //si viene remember_user(si se tilda casilla "recordarme")
          res.cookie("userEmail", req.body.email, { maxAge: 1000 * 60 * 60 });
          //creo la cookie llamada "userEmail" que contiene el email escrito por el usuario
        }

        return res.redirect("/user/profile"); //REDIRIGE A PERFIL DE USUARIO
      }

	  /* ====================================================================
=======================================================================
                    EN EL MIDDLEWARE
========================================================================
======================================================================= */
const User = require('../models/User');

//PROPOSITO: PREGUNTAR SI TENGO A ALGUIEN EN SESSION

function userLoggedMiddleware(req, res, next) {
  res.locals.isLogged = false; //Variable "isLoggged" que puedo pasar en todas las vistas
  //Esta por defecto en false (cuando no tengo a nadie en session)

  /* 1-VERIFICO SI TENGO A ALGUIEN EN LA COOKIE */

  let emailInCookie = req.cookies.userEmail; //obtengo lo que vino en userEmail (cookie seteada en
  //el controlador, metodo "loginProcces")

  /* 2-VERIFICO SI ESTA REGISTRADO EN LA BASE DE DATOS */
  let userFromCookie = User.findByField("email", emailInCookie);
  //con el mail obtengo el usuario mediante el metodo find<ByField
  //pasandole el mail que tengo en la cookie

  /* 3-SI TENGO UN USUARIO LOGUEDO EN AL COOKIE LO PASO A SESSION*/

  if (userFromCookie) { 
    //Si tengo el usuario de la cookie
    req.session.userLogged = userFromCookie; //Paso al usuario de la cookie a session para
    //seguir manteniendolo aunque expire la cookie
  }

  if (req.session.userLogged) {
    //tengo a alguien en session
	//entonces tengo a alguien logueado

    res.locals.isLogged = true; //para mostrar en la navbar nombre y avatar del usuario
	//logueado en lugar del register y login
    res.locals.userLogged = req.session.userLogged; // Estoy pasando lo que tengo en session
    //a una variable local que pueda ser compartida con todas las vistas (en este caso "userLogged")
  }

  next();
}

module.exports = userLoggedMiddleware;
	  /* ====================================================================
=======================================================================
                EN EL METODO LOGOUT DESTRUYO LA COOKIE
========================================================================
======================================================================= */</ul>

logout: (req, res) => {
	res.clearCookie('userEmail');//clearCookie elimina la cookie que yo le indique
	req.session.destroy();//Borro todo lo que tengo en session(usuario logueado)
	return res.redirect('/');
}
/* ====================================================================
=======================================================================
                       Hasheo de una contraseña
========================================================================
======================================================================= */


/* 1- Instalo el modulo  */

npm i bcryptjs

/* 2- En el controlador */
const bcryptjs = require('bcryptjs');//Lo requiero para encriptar el password


/*En el metodo que uso para REGISTRAR un nuevo usuario*/

password: bcryptjs.hashSync(req.body.password, 10),/* guardo la contraseña encriptada con el
medoto "hashSync", que recibe como parametro la contraseña en texto plano,(ingresado por el usuario)
y el SAL (que va de 10 a 12) */

/* En el metodo que uso para LOGUEAR un usuario: COMPARO LA CONTRASEA INGRESADA 
CON LA GUARDADA EN LA BASE DE DATOS (QUE ESTA ENCRIPTADA) */

let comprobacionPassword = bcryptjs.compareSync(req.body.password, usuario.password);
/* Con "compareSync" comparo la contraseña ingresada por el usuario con la contraseña guardada en la DB
primero siempre va el texto plano(ingresado por el usuario) y luego el password de DB que esta hasheado */