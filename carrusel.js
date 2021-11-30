/* CAROUSEL DINAMICO */

/* ALIMENTADO POR BANNER.JSON */

["banner_1.jpg","banner_2.jpg","banner_3.jpg","banner_4.jpg"]

/* EN EL INDEXCONTROLLER MANDO BANNER */

const banner = require('../data/banner.json')

module.exports = {
    index : (req,res) => {
        return res.render('index',{
            title : "Craftsy 2.0",
            productos,
            nuevos : productos.filter(producto => producto.category === "nuevo"),
            refact : productos.filter(producto => producto.category === "refaccionado"),
            usados : productos.filter(producto => producto.category === "usado"),
            banner,
            tutoriales
        })
    }


/* EN LA VISTA INDEX */

<section class="banner">
<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <% for( let index = 1; index < banner.length; index++ ) { %>
      /* Esto es para que me ponga la misma cantidad de botones que de imagenes */
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="<%= index %> " aria-label="Slide 2"></button>
        <% } %>
    </div>
    <div class="carousel-inner">
        <div class="carousel-item active" id="carousel1" style="background-image: url('/images/banner/<%=banner[0]%>');"></div>
        {/* La primer imagen tiene que ser "active" para que te la muestre */}
        <% for( let index = 1; index < banner.length; index++ ) { %>
       /*  Uso un for (no foreach-xq me recorre todo el array desde la posicion 0 y me repitiria la primer imagen) */
            <div class="carousel-item" id="carousel1" style="background-image: url('/images/banner/<%=banner[index]%>');"></div>
        <% } %>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</section>

/* EN EL INDEX.CSS  */

.home .banner .carousel-item{
    height: 355px;
    width: 100%;
    background-size: 100%;
}