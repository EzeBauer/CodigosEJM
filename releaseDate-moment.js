/* En la terminal */

npm i moment

/* En el controllers */
let moment= require("moment");


 edit: (req, res) =>{
    let Movie= db.Movie.findByPk(req.params.id, {
        include: ["genre"],
      });
     let allGenres= db.Genre.findAll()
     Promise.all([Movie, allGenres])
     .then(([Movie, allGenres])=>

     res.render("moviesEdit", {
      Movie,
      allGenres,
      fecha: moment(Movie.release_date).format("YYYY-MM-DD"),
    })).catch(error => console.log(error))
  },

 /*  El la vista movieEdit */
  <p><input type="date" name="release_date" id="" value="<%= fecha %>" required></p>