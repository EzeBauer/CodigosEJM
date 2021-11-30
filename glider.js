/*==============================================
EN EL productsController, en el metodo 'detail
================================================*/

  detail : (req,res) => {
        let producto = productos.find(producto => producto.id === +req.params.id);

        return res.render('productDetail',{
            producto,
            productos,
            relacionados : productos.filter(item => item.category === producto.category)
        }) /*del producto encontrado, filtra los productos por la misma categoria*/
    },
    
/*==============================================
EN LA CARPETA JAVASCRIPT DEL FRONT PONGO EL ARCHIVO
GLIDER.JS, Y EN LA CARPETA CSS PONGO EL ARCHIVO 
GLIDER.CSS
================================================*/

/*==============================================
EN EL ARCHIVO STYLES.CSS IMPORTO GLIDER
================================================*/
@import url('glider.css');

/*==============================================
EN PARTIAL/SCRIPTS PASO EL SCRIPT DE GLIDER
================================================*/
<script src="/javascripts/glider.js"></script>

/*==============================================
EN LA CARPETA JAVASCRIPT DEL FRONT CREO EL ARCHIVO
'productDetail' con el siguiente contenido
================================================*/
new Glider(document.querySelector('.glider'), {
    // Mobile-first defaults
    slidesToShow: 1,
    slidesToScroll: 1,
    scrollLock: true,
    dots: '#resp-dots',
    arrows: {
      prev: '.glider-prev',
      next: '.glider-next'
    },
    responsive: [
      {
        // screens greater than >= 775px
        breakpoint: 768,
        settings: {
          // Set to `auto` and provide item width to adjust to viewport
          slidesToShow: 3,
          slidesToScroll: 1,
          itemWidth: 150,
          duration: 0.25
        }
      },{
        // screens greater than >= 1024px
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
          itemWidth: 150,
          duration: 0.25
        }
      }
    ]
  });

  /*==============================================
EN LA VISTA 'PRODUCTDETAIL' 
================================================*/
  <%- include('./partials/scripts')  %> //ESTE INCLUYE EL SCRIPT DE GLIDER
    <script src="/javascripts/productDetail.js"></script>

//Y ARMO EL SIGUIENTE BLOQUE DE CODIGO
    <div class="relacionados mt-5">
                  <h4>Productos relacionados</h4>
                  <hr>
                  <div class="glider-contain">
                    <div class="glider">
                      <% relacionados.forEach(producto => { %>
                        <div class="d-flex flex-column align-items-center ">
                          <img class="w-100" src="/images/<%= producto.images[0] %>" alt="">
                          <p class="mt-4"><%= producto.title %> </p>
                        </div>
                      <% }) %>
                     
                    </div>
                    <button aria-label="Previous" class="glider-prev">«</button>
                    <button aria-label="Next" class="glider-next">»</button>
                    <div role="tablist" class="dots"></div>
                  </div>
                </div>

