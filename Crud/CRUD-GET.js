const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include : ['genre']
            })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui debo modificar para crear la funcionalidad requerida
    'buscar': async (req, res) => {
        try {
            const response = await fetch(
               `http://www.omdbapi.com/?t=${req.query.titulo}&apikey=b87d6c3e`
            );
            const movie = await response.json()
            return res.render('moviesDetailOmdb', {
                movie
            })
        } catch (error) {
            console.log(error)
        }
        
    },

  /*   En las rutas */

  const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

router.get('/movies', moviesController.list);
router.get('/movies/new', moviesController.new);
router.get('/movies/recommended', moviesController.recomended);
router.get('/movies/detail/:id', moviesController.detail);

/* en la vista moviesList */
<body>
    <figure>
        <img src="/img/logo-DH.png" alt="Logo Digital House">
    </figure>
    <h1>LISTADO DE PELÍCULAS</h1>
    <br>
    <p>
        <a class="botonAgregar" href="/movies/add">Agregar una Pelicula</a>
        <a class="botonVolver" href="/">inicio</a>

    </p>
    <br>
    <div class="buscar-titulo">
        <form action="/movies/buscar" method="GET">
            <input type="text" name="titulo" id="titulo">
            <button class="boton-buscar" type="submit">Buscar una Pelicula</button>
        </form>
        
    </div>
    <ul>
        <% for( let i = 0; i < movies.length; i++ ) { %>
        <li>
            <a href="/movies/detail/<%= movies[i].id %>"><%= movies[i].title %></a>
        </li>
        <% } %>

    </ul>
</body>

/* en la vista moviesDetail */


<body>
    <figure>
        <img src="/img/logo-DH.png" alt="Logo Digital House">
    </figure>
    <h1><%= movie.title %> </h1>    
    <br>
    <p>CALIFICACIÓN: <%= movie.rating %> </p>
    <p>PREMIOS: <%= movie.awards %> </p>
    <p>DURACIÓN: <%= movie.length + ' min'%> </p>
    <p>FECHA DE CREACIÓN: <%= movie.release_date %> </p>
    <br>
    <section>
        <a class="botonModificar" href="/movies/edit/<%= movie.id %>">Modificar</a>
        <a class="botonBorrar" href="/movies/delete/<%= movie.id %>">Borrar</a>
        <a class="botonVolver" href="/movies">Listado de Películas</a>
    </section>

</body>

/* En la vista newestMovies */
    
<body>
    <figure>
        <img src="/img/logo-DH.png" alt="Logo Digital House">
    </figure>
    <h1>PELIÍCULAS ORDENADASR FECHA</h1>
    <ul>
        <% for( let i = 0; i < movies.length; i++ ) { %>
        <li>
            <a href="/movies/detail/<%=movies[i].id%>"><%= movies[i].title %> </a> <br>
            <%= 'RELEASE DATE: ' + movies[i].release_date %> 
        </li>
        <% } %>
        
    </ul>
</body>

/* En la vista recomendedMovies */

<body>
    <figure>
        <img src="/img/logo-DH.png" alt="Logo Digital House">
    </figure>
    <h1>PEÍCULAS ORDENADAS POR POSICIÓN</h1>
    <ul>
        <% for( let i = 0; i < movies.length; i++ ) { %>
        <li>
            <a href="/movies/detail/<%=movies[i].id%>"><%= movies[i].title %> </a> <br>
            <%= 'RATING: ' + movies[i].rating %> 
        </li>
        <% } %>
        
    </ul>
</body>

/* En la vista moviesDetailOmbd */

<body>
    <figure>
        <img src="/img/logo-DH.png" alt="Logo Digital House">
    </figure>
    <h1><%= movie.Title %> </h1>    
    <br>
    <figure>
        <img src="<%= movie.Poster %>" alt="<%= movie.Title %>">
    </figure>
    
    <p>AÑO: <%= movie.Year %> </p>
    <p>PREMIOS: <%= movie.Awards %> </p>
    <p>DURACIÓN: <%= movie.Runtime%> </p>

    <br>
    

</body>