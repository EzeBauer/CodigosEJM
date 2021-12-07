 //DELETE
 delete: async (req, res) => {
    try {
      let movie= await db.Movie.findByPk(+req.params.id)
      .then((movie) => {
        console.log(movie.image);
          /*  if (movie.image!== null) {
             let imgABorrar = path.join(
               __dirname,
               `../images/movies/${movie.image}`
             );
             
             fs.unlinkSync(imgABorrar);
           } */
          
           movie.destroy();
    
          let respuesta = {
            status: 200,
            msg: "Pelicula eliminada con éxito",
          };
          return res.status(200).json(respuesta);
        })
        .catch((e) => {
          let error = {
            status: 404,
            msg: "Pelicula no encontrado",
          };
          res.status(500).json(error);
        });
    } catch (err) {
      let error = {
        status: 500,
        msg: "Error interno del servidor",
      };
      res.status(500).json(error);
    }
  },

  //000000000000000000000000000 RUTA 0000000000000000000000000000000

  var express = require("express");
var router = express.Router();

//Middlewares & Validations
let upload = require("../middlewares/multerMoviesConfig");
let moviesValidator=require("../validations/MovieValidator")

//Controllers
let moviesController = require("../controllers/moviesControllers");


router.delete("/:id", moviesController.delete);