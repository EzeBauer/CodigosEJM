const db = require('../database/models');
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




module.exports = {
  register: async (req, res) => {
    const errors = validationResult(req);
    try {
      if (errors.isEmpty()) {
        const user = await db.User.create({
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password)
        });
        console.log(user);

       

        //Generar token
        //datos de usuario
        const userToken={
          id:user.id,
          email:user.email,
        }
        //Firma digital
        const token = jwt.sign(userToken, process.env.SECRETKEY, { //PALABRA SECRETA GUARDAD EN VARIABLE DE ENTORNO
          expiresIn: "10h",
        });
        //Fin generar token

        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.email, // Change to your recipient
          from: "bauereze@gmail.com", // Change to your verified sender
          subject: "Bienvenido a la apiDIsney",
          text: "Te damos la Bienvenida a nuestra api, en donde podras explorar los actores y peliculas del mundo Disney. Por favor, tene en cuenta que para utilizar los enpoints deberas ingresar en authotization, Barer tu token de usuario",
          html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });

        return res.status(201).json({
          status: 201,
          msg: 'Usuario creado satisfactoriamente!. Verifique su email :)',
          token
        });
      } else {
        return res.status(400).json({
          status: 400,
          msg: 'Hubo un error al crear el usuario',
          errores: errors.mapped()
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
 
};


//000000000000000000000000000000000 RUTAS 000000000000000000000000000000000000000000000

var express = require("express");
var router = express.Router();

//Middlewares & validations
const authValidatorRegister = require("../validations/authValidatorRegister");


//Controllers
const authController = require("../controllers/authController");

router.post("/register", authValidatorRegister, authController.register);

module.exports = router;

//0000000000000000000000000000000 VALIDADOR 000000000000000000000000000000000000000000000

const { check, body } = require("express-validator");
const db = require("../database/models");

module.exports = [
 
  body("email").custom((value) => {
    return db.User.findOne({ where: { email: value } })
    .then((user) => {
      if (user) {
        return Promise.reject(
          "El email ingresado ya está en uso. Iniciá sesión!"
        );
      }
    });
  }),
  check("password")
    .notEmpty()
    .withMessage("Debe ingresar una contraseña")
    .isStrongPassword()
    .withMessage(
      "La contraseña debe tener como minimo 8 caracteres, una letra minuscula, una mayuscula, un numero y almenos 1 simbolo"
    ) 
    
  
];