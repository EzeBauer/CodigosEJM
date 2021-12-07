
//00000000000000000000000 MODELO MOVIE0000000000000000000000

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Movie.belongsTo(models.Genre, {
         as: "genre",
         foreignKey: "genreId",
         onDelete: "cascade",
         onUpdate: "cascade",
       });
       Movie.belongsToMany(models.Character, {
         as: "characters",
         through: "characterMovies",
         foreignKey: "movieId",
         otherKey: "characterId",
         onDelete: "cascade",
         onUpdate: "cascade",
       });
    }
  };
  Movie.init({
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    releaseDate: DataTypes.DATE,
    rating: DataTypes.DECIMAL,
    genreId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};




//000000000000000000000000000000 CONTROLLER 000000000000000000000000000000

const db = require("../database/models");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const getURLBase = (req) => `${req.protocol}://${req.get("host")}/movies`;
const fs = require("fs");


create: (req, res) => {
    const { title, releaseDate, rating, genreId } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        db.Movie.create({
          title,
          image: req.file.filename,
          releaseDate,
          rating,
          genreId,
        }).then(() => {
          let respuesta = {
            status: 201,
            msg: "Recurso creado con éxito",
          };
          res.status(201).json(respuesta);
        });
      } catch (error) {
        console.log(err);
        return res.status(500).json(err);
      }
    } else {
      if (req.file) {
        let imgABorrar = path.join(
          __dirname,
          "../images/movies/" + req.file.filename
        );
        console.log(imgABorrar);
        fs.unlinkSync(imgABorrar);
      }
      let error = {
        status: 400,
        msg: "Error en uno o más campos del form",
        errores: errores.mapped(),
      };
      res.status(400).json(error);
    }
  },


  //============================ VALIDADOR =====================================================

  const { check, body } = require("express-validator");
const db = require("../database/models");
const path = require("path");

module.exports = [
  check("title")
    .notEmpty()
    .withMessage("Este campo no puede estar vacio.")
    .isLength({ max: 100 })
    .withMessage("El maximo de caracteres permitidos es 100!")
    .bail(),
  body("image").custom((value, { req }) => {
    let exceptedFile = [".jpg", ".png", ".jpeg", ".gif"];

    if (!req.file) {
      throw new Error("La imagen es requerida");
    }

    if (!exceptedFile.includes(path.extname(req.file.originalname))) {
      throw new Error(
        "El tipo de archivo no es admitido. Solo se permiten archivos png, jpg, jpeg, gif"
      );
    }

    return true;
  }),
  check("rating")
    .notEmpty()
    .withMessage("Este campo no puede estar vacio")
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("Este campo solo acepta numeros decimales ej: 4.0"),

  body("genreId")
    .notEmpty()
    .withMessage("Es necesario asociar un genero a la pelicula!.")
    .isInt()
    .withMessage("Valor invalido")
    .custom((value, { req }) => {
      return db.Genre.findByPk(value)
        .then((gender) => {
          if (!gender) {
            return Promise.reject();
          }
        })
        .catch(() => {
          return Promise.reject("El genero no existe");
        });
    }),
];


//000000000000000000000000000000 RUTA 00000000000000000000000000000000000000000000000000

var express = require("express");
var router = express.Router();

//Middlewares & Validations
let upload = require("../middlewares/multerMoviesConfig");
let moviesValidator=require("../validations/MovieValidator")

//Controllers
let moviesController = require("../controllers/moviesControllers");


//CRUD routes
router.post("/", upload.single("image"),moviesValidator ,moviesController.create);


//00000000000000000000000 multerMoviesConfig.js 0000000000000000000000000000000000000000000

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"../images/movies"));
    },
    filename: function(req, file, cb){
        cb(null, "_img_"+Date.now()+path.extname(file.originalname));
    }
});
const upload = multer({storage});
module.exports = upload;