const bcryptjs = require('bcryptjs');//para encriptar el password- que sea brcyptjs
const {validationResult} = require('express-validator');

const User = require('../models/User');//Requiero el modelo para usar en los metodos del controlador

const controller = {
	register: (req, res) => {
		/* ==========================================
		 res.cookie('testing', "Hola Mundo", {maxAge:1000 *30}) 
		Setea la cookie
		========================================== */

		return res.render('userRegisterForm');
	},
	processRegister: (req, res) => {
		const resultValidation = validationResult(req);

		if (resultValidation.errors.length > 0) { //si vienen errores
			return res.render('userRegisterForm', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}
		//PARA NO REGISTRAR UN MISMO USUARIO DOS VECES, ANTES DE CREAR UN USUARIO
		let userInDB = User.findByField('email', req.body.email);
		//Me compara el email ingresado con los que ya estan en la base de datos

		if (userInDB) {//si ese email ya esta en la base de datos
			return res.render('userRegisterForm', {
				errors: {
					email: {
						msg: 'Este email ya está registrado'
					}
				},//retorna el error y no me guarda el usuario
				oldData: req.body // Me mantiene la informacion que el usuario ingreso previamente
			});
		}
		//SI NO ESTA REGISTRADA SIGO CON EL PROCESO, GENERO LA INFORMACION DEL USUARIO

		let userToCreate = {
			...req.body, //me trae todo lo que trajo el body
			password: bcryptjs.hashSync(req.body.password, 10),//guardo la contraseña encriptada
			//un objeto literal no puede tener dos propiedades con el mismo nombre
			// este password pisa al password que me trae el req.body requerido antes
			avatar: req.file.filename //uso el filename- nombre del archivo de imagen subido
		}

		let userCreated = User.create(userToCreate);//Creo el usuario con el metodo del modelo

		return res.redirect('/user/login');//lo redirige al formulario del login
	},
	//renderiza a la vista del login para que sea cargado
	login: (req, res) => {
	
		return res.render('userLoginForm');
	},
	loginProcess: (req, res) => {
    let userToLogin = User.findByField("email", req.body.email);
    //busco por el email que me ingreso al usuario en la DB

    if (userToLogin) {
      //si tengo el usuario con el email ingresado

      //COMPARO LA CONTRASEñA INGRESADA CON LA DE LA BASE DE DATOS ENCRIPTADA
      let isOkThePassword = bcryptjs.compareSync(
        req.body.password,
        userToLogin.password
      );

      //primero el texto plano(ingresado por el usuario) y luego el password hasheado
      if (isOkThePassword) {
        // SI HAN COINCIDIDO LAS CONTRASEñAS
        delete userToLogin.password; //borramos la propiedad password por seguridad

		/* ======================SESSION======================== */
        req.session.userLogged = userToLogin;
        //en session creo una propiedad (userLogged) que me guarda la info del usuario logueado

        if (req.body.remember_user) {
          //si viene remember_user(si se tilda casilla "recordarme")
          res.cookie("userEmail", req.body.email, { maxAge: 1000 * 60 * 60 });
          //creo la cookie llamada "userEmail" que contiene el email escrito por el usuario
        }

        return res.redirect("/user/profile"); //REDIRIGE A PERFIL DE USUARIO
      }
      //SI NO COINCIDEN LAS CONTRASEÑAS
      return res.render("userLoginForm", {
        errors: {
          email: {
            msg: "Las credenciales son inválidas",
          },
        },
      });
    }
    //SI NO TENGO UN USUARIO CON ESE EMAIL REGISTRADO
     return res.render('userLoginForm', {
			errors: {
				email: {
					msg: 'No se encuentra este email en nuestra base de datos'
				}
			}
		}); 
  },
	profile: (req, res) => {
		return res.render('userProfile', {
			user: req.session.userLogged //em la vista le paso la variable user que
			//tiene la informacion de usuario logueado "userLogged" (todo menos la contraseña)
		});
	},
	//	PARA CERRAR UNA SESSION
	logout: (req, res) => {
		res.clearCookie('userEmail');//clearCookie elimina la cookie que yo le indique
		req.session.destroy();//Borro todo lo que tengo en session(usuario logueado)
		return res.redirect('/');
	}
}

module.exports = controller;