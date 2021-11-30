function guestMiddleware(req, res, next) {
	if (req.session.userLogged) { //Si tengo a alguien en session (logeado)
		return res.redirect('/user/profile'); //lo dirijo a la vista de su perfil
	}
	next();//si no hay nadie en session que siga con el controlador
}

module.exports = guestMiddleware;