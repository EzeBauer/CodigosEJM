
list: (req, res) => {
    console.log(req.query);
    let query;
    if (req.query.title) {
        query = "title"
    } else if (req.query.genre) {
        query = "genreId"
    } else {
        query = "title"
    }
    try {
        db.Movie.findAll({
            attributes: ["id", "title", "image", "releaseDate"],
            include: [
                { association: "genre", attributes: ["id", "name", "image"] }
            ],
            where: {
                title: {
                    [Op.substring]: req.query.title ? req.query.title : "",
                },
                genreId: {
                    [Op.substring]: req.query.genre ? req.query.genre : "",
                },

            },
            order: [
                [query, req.query.order && req.query.order.toUpperCase() !== "ASC" ? req.query.order : "ASC"]
            ]
        }).then((data) => {
            let respuesta = {
                status: 200,
                length: data.length,
                url:getURLBase(req),
                data: data,
            };
            res.status(200).json(respuesta);
        });
    } catch (error) {
        let errorBD = {
            status: 500,
            msg: "Error Interno del Servidor",
        };
        res.status(500).json(errorBD);
    }
},

 //0000000000000000000000000  RUTA 00000000000000000000000000000000000

  //Controllers
  let moviesController = require("../controllers/moviesControllers");

  //LIST, DETAIL AND SEARCH
  //RUTE: /movies
  
  router.get("/", moviesController.list);

  //000000000000000000000000000 EN APP.JS 00000000000000000000000000000000

const moviesRouter = require('./routes/moviesRouter');

app.use("/movies", moviesRouter);
   

/* ==================================EMPOINTS============================================== */

## Lista de Peliculas
GET http://localhost:3000/movies HTTP/1.1
<p>content-type: application/json</p>



###
## Buscar por título en orden desc
GET http://localhost:3000/movies?title=k&order=desc HTTP/1.1
<p>content-type: application/json</p>

###

## Filtrar por género [accion[id:1], animación[id:2], aventura[id:3], drama[id:4]]
GET http://localhost:3000/movies?genre=1 HTTP/1.1
<p>content-type: application/json</p>

###

## Ordenar ASC | DESC
GET http://localhost:3000/movies?order=asc HTTP/1.1
<p>content-type: application/json</p>

###

