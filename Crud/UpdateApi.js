



//UPDATE
update: async (req, res) => {
    try {
      console.log("llego aqui try");

      let movie = await db.Movie.findByPk(+req.params.id).then(
        (movie) => movie.dataValues
      );
      console.log(movie);
      let errores = validationResult(req);
      if (errores.isEmpty()) {
        if (req.file) {
          let imgABorrar = path.join(
            __dirname,
            "../images/movies/" + movie.image
          );
          fs.unlinkSync(imgABorrar);
        }
        let { title, rating, releaseDate } = req.body;

        db.Movie.update(
          {
            title: title ? title : movie.title,
            image: req.file ? req.file.filename : movie.image,
            rating: rating ? rating : movie.rating,
            releaseDate: releaseDate ? releaseDate : movie.releaseDate,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        )
          .then(() => {
            let respuesta = {
              status: 200,
              url: getURLBase(req) + `edit/${req.params.id}`,
              msg: "Recurso actualizado con éxito",
            };
            res.status(200).json(respuesta);
          })
          .catch((e) => {
            let respuesta = {
              status: 404,
              msg: "Recurso no encontrado",
            };
            res.status(404).json(respuesta);
          });
      } else {
        if (req.file) {
          let imgABorrar = path.join(
            __dirname,
            "../images/movies/" + req.file.filename
          );
          fs.unlinkSync(imgABorrar);
        }
        let error = {
          status: 400,
          msg: "Error en uno o más campos del form",
          errores: errores.mapped(),
        };
        res.status(400).json(error);
      }
    } catch (err) {
      let error = {
        status: 500,
        msg: "Recurso no encontrado",
      };
      res.status(500).json(error);
    }
  },


  //00000000000000000000000000000  RUTE 0000000000000000000000000000000000

var express = require("express");
var router = express.Router();

//Middlewares & Validations
let upload = require("../middlewares/multerMoviesConfig");
let moviesValidator=require("../validations/MovieValidator")

//Controllers
let moviesController = require("../controllers/moviesControllers");


//CRUD routes
router.put("/:id", upload.single("image"), moviesController.update);

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