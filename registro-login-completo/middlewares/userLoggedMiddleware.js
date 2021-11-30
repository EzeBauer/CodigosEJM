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

  /* 3-SI TENGO UN USUARIO LOGUEDO EN AL COOKIE LO PASO A SESSION*/

  if (userFromCookie) {
    //Si tengo el usuario de la cookie
    req.session.userLogged = userFromCookie; //Paso al usuario de la cookie a session para
    //seguir manteniendolo aunque expire la cookie
  }

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