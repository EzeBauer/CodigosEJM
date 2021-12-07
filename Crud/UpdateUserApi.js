 update: (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      
      db.User.findByPk(req.params.id)
        .then((user) => {
          console.log(user);
          db.User.update(
            {
              
              email: req.body.email ? req.body.email : user.email,
              password: req.body.password? bcrypt.hashSync(req.body.password.trim(),10): user.password,
            },
            { where: {id: req.params.id } }
          )
            .then((user) => {
              console.log(user);
              return res.status(201).json({
                status: 200,
                msg: "Usuario actualizado satisfactoriamente!",
                data:user
              });
            })
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json();
        });
    } else {
      return res.status(400).json({
        status: 400,
        msg: "Hubo un error al actualizar los datos del usuario",
        errores: errors.mapped(),
      });
    }
  },

  delete: (req, res) => {
    db.User.destroy({ where: { id: req.params.id } })
      .then(() => {
        res.status(200).json({
          status: 200,
          msg: "Usuario eliminado satisfactoriamente!.",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json(err);
      });
  },
};

//0000000000000000000000000000000000 RUTA 0000000000000000000000000000000000000000000000

var express = require("express");
var router = express.Router();

//Middlewares & validations
const userUpdateValidator = require("../validations/userUpdateValidator");


//Controllers
const usersController = require("../controllers/usersController");


router.put("/:id", userUpdateValidator, usersController.update);

router.delete("/:id", usersController.delete);

module.exports = router;

//000000000000000000000000 userUpdateValidator 00000000000000000000000000000000000000000
const { check, body } = require("express-validator");
const db = require("../database/models");

module.exports = [
  
  check("password")
    .notEmpty()
    .withMessage("Debe ingresar una contraseña")
    .isStrongPassword()
    .withMessage(
      "La contraseña debe tener como minimo 8 caracteres, una letra minuscula, una mayuscula, un numero y almenos 1 simbolo"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas deben coincidir");
    }
    return true;
  }),
];
