const db = require('../database/models');
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




module.exports = {
 
  login: async (req, res) => {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
      try {
        const user = await db.User.findOne({
          where: { email: req.body.email }
        });

        const userForToken = {
          id: user.id,
          email: user.email
        };

        const token = jwt.sign(userForToken, process.env.SECRETKEY, {
          expiresIn: '10h'
        });

        res.status(200).json({
          status: 200,
          msg: `Inserte este token en la pestaña Authorization > Bearer Token`,
          token
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json(error);
      }
    } else {
      return res.status(400).json({
        status: 400,
        errors: errors.mapped(),
        msg: 'credenciales invalidas'
      });
    }
  }
};

//00000000000000000000000000000000000 RUTA 000000000000000000000000000000000000000000000

var express = require("express");
var router = express.Router();

//Middlewares & validations
const authValidatorLogin = require("../validations/authValidatorLogin");

//Controllers
const authController = require("../controllers/authController");

router.post("/login", authValidatorLogin, authController.login);

module.exports = router;


//000000000000000000000000000000000000000 VALIDAOR 000000000000000000000000000000000000000000

const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../database/models");

module.exports = [
  check("email")
    .notEmpty()
    .withMessage("Este campo no puede estar vacio!")
    .normalizeEmail()
    .isEmail()
    .withMessage("El email es invalido. Ej:name@mail.com")
    .bail(),
  body("email").custom((value,  {req}) => {
    return db.User.findOne({ where: { email: value } })
      .then((user) => {
        if (!user || !bcrypt.compareSync(req.body.password, user.password)){
          return Promise.reject()
        }
      })
      .catch(() => {
        return Promise.reject("Credenciales invalidas!");
      });
  })
];