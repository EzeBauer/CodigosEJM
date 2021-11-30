function authMiddleware(req, res, next) {
	if (!req.session.userLogged) {//si no tengo a nadie en session
		return res.redirect('/user/login');//lo redirijo a login
	}
	next();// si tengo a alguien, que siga la peticion
}

module.exports = authMiddleware;