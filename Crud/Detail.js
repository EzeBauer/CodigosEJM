
  //00000000000000000000000 MOVIE DETAIL 0000000000000000000000000000
  detail: (req, res) => {
    try {
      db.Movie.findByPk(req.params.id, {
        include: [
          { association: "characters", attributes: ["id", "image", "name"] },
          { association: "genre", attributes: ["id", "name", "image"] },
        ],
      })
        .then((movie) => {
          let respuesta = {
            status: 200,
            url: getURLBase(req) + `/${movie.id}`,
            data: movie,
          };
          res.status(200).json(respuesta);
        })
        .catch((e) => {
          let errorBD = {
            status: 404,
            msg: "Recurso no encontrado",
          };
          res.status(404).json(errorBD);
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },


  //0000000000000000000000000  RUTA 00000000000000000000000000000000000

  //Controllers
let moviesController = require("../controllers/moviesControllers");

//LIST, DETAIL AND SEARCH
//RUTE: /movies


router.get("/:id", moviesController.detail);

//000000000000000000000000000 EN APP.JS 00000000000000000000000000000000

const moviesRouter = require('./routes/moviesRouter');

app.use("/movies", moviesRouter);


  /* 000000000000000000000000MODELO MOVIE000000000000000000000000000000 */

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