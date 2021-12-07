0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
CONSUMIENDO DE UNA API 
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000



/*============================EN EL API CONTROLLER ==================================*/

search: async (req, res) => {
    console.log(req.query.keywords);
    try {
      let products = await db.Product.findAll({
        include: [{ association: "category" }],
        where: {
          [Op.or]: [
            {
              title: {
                [Op.substring]: req.query.keywords,  //input type="search" name="keywords"
              },
            },
            {
              description: {
                [Op.substring]: req.query.keywords,
              },
            },
          ],
        },
      });
       let response = {
        status: 200,
        meta: {
          total: products.length,
          url: getURL(req),
        },
        data: products,
      };
      console.log(response);
      return res.status(200).json(response);
      
    } catch (error) {
      throwError(res, error);
    }
  },


/*=================================== EN LA VISTA========================================================= */

<div class="col-12 col-md-4">
<form action="" id= "form-search" class="formSearch">
  <input id="input-search" name="keywords" class="form-control me-2" type="search" placeholder="Buscar productos..." aria-label="Search">
    <button class="btn btn-outline-dark searchButton" type="submit">Buscar</button>
  </form>
</div>





/*=========================================== En el archivo JS front===================================== */



 async function search(keywords) {  //keywords repersenta la palabra ingresada por el usuario
    $("#table-products").innerHTML="";
   
      try {
        let response = await fetch("/api/products/search?keywords=" + keywords);
        let result = await response.json();
        console.log(result.data);

        if (result.meta.total > 0) {
          result.data.forEach((product) => { //data contiene todos los productos encontrados para la busqueda
            addItem(product);
            $(
              ".productos"
            ).innerHTML = `<p><b>Productos encontrados para la busqueda ${keywords}: ${result.meta.total}</b></p>`;
          });
        } else {
          $(
            ".productos"
          ).innerHTML = `<p><b>No hay resultados para la busqueda: ${keywords}</b></p>`;
        }
        borrar();
      } catch (error) {
        console.log(error);
      }
};


const $ = (id) => document.querySelector(id);
const $1 = (id) =>document.getElementById(id);
const query =new URLSearchParams(location.search); {/* recorta el url y nos devuelve el query string entero (ej ?keywords= rosalia)*/}


 $(".searchButton").addEventListener("click", (e) => { /* cuando click en el boton buscar */
    e.preventDefault();
     $("#table-products").innerHTML = "";
       $(
         ".productos"
       ).innerHTML = "";
    query.set("keywords", $1("input-search").value); //query.set crea la query "keywords" y se le pasa lo que guardara (en este caso, la palabra ingresada por el usuario)
    history.replaceState({}, "", `${location.pathname}?${query}`); //Cambia el query string en la barra de direccion de la web
     if (query.get("keywords")!==""){//query.get("keywords") nos toma la palabra ingresada por el usuario
       search(query.get("keywords")); 
  }else{
     $(
         ".productos"
       ).innerHTML ="<P><b>Ingresa una palabra para la busqueda</b></p>"
  }
    
      
 })

00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

SIN CONSUMIR DE UNA API

0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000


/*================================= EN EL CONTROLLERS================================= */

 search: (req, res) => {

    db.Product.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search,
          }
        },
        {
          description: {
            [Op.substring]: req.query.search,
          }
        }
      ]
    },
  }).then(resultado => 
    res.render("resultado", {
    resultado,
    busqueda: req.query.search,
  })).catch(error => console.log(error))
},

/* ====================================EN LA VISTA====================================== */

<div class="buscador d-flex flex-column">
              
<form id="formHome" action="/productos/search" type="search">
  <button id="buttonHome" type="submit"><i class="fas fa-search"></i></button>

<input id="inputSearch" type="text" name="search" placeholder="   Busca tus productos!">

</form>

<div id="mensajebusqueda">
  
</div>
</div>


/*================================ EN EL JAVASCRIPT FRONT============================== */

const $11 = (id) => document.getElementById(id);


$11("buttonHome").addEventListener("click", (e) => { //Cuando presiono el boton buscar
     e.preventDefault();
if($11("inputSearch").value!==""){  //si se ingreso un valor para la busqueda
    $11("formHome").submit()   //Enviar el formulario
}else{
    $11("mensajebusqueda").innerHTML='<p class="text-danger">Por favor ingresa una palabra para la búsqueda<p>'
}
}) 


00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
Otro caso en una api
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

//SEARCH MOVIES BY PARAMETERS
search: (req, res) => {
  let movies = db.Movie.findAll({
    include: [{ association: "genre", attributes: ["id", "name", "image"] }],

    where: {
      title: { [Op.substring]: req.query.title },
    },
   
    attributes: ["id", "title", "image", "createdAt", "genreId"],
  });
     let genres = db.Genre.findAll({
    include: [{ association: "movies" }],
    where: {
      name: { [Op.substring]: req.query.genre },
    },
  });

 
  Promise.all([movies, genres])
    .then(([movies, genres]) => {
            
      return res.status(200).json({
        status: 200,
        total:
          movies.length || genres.length
            ? movies.length || genres.length
            : "No hay peliculas que mostrar",
          
        movies,
        genres,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(500);
    });
},

//0000000000000000000000000  RUTA 00000000000000000000000000000000000

//Controllers
let moviesController = require("../controllers/moviesControllers");

//LIST, DETAIL AND SEARCH
//RUTE: /movies
router.get("/search", moviesController.search);



/* ===========================EMPOINTS================================ */

## Buscar peliculas por genero o titulo
GET http://localhost:3000/movies/search?genre=drama HTTP/1.1
GET http://localhost:3000/movies/search?title=piratas HTTP/1.1
<p>content-type: application/json</p>

###
