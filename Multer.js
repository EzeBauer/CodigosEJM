/* =================MULTER============== */


/* ===========================================
EN LA TERMINAL: LO INSTALO
=========================================== */

npm i multer


/* ===========================================
EN MIDDLEWARES/MULTER.JS
=========================================== */

const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");//Indica en donde se va a guardar la imagen
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
    //indica el nombre del archivo. path.extname(extrae la extension del archivo(de su nombre original))
  },
});
const upload = multer({ storage });

module.exports = upload;

/* ===========================================
EN EL ARCHIVO DE RUTA EN DONDE LO VAMOS A UTILIZAR
=========================================== */


const multer = require('multer'); 
const upload = require("../middlewares/multer");
router.put("/modificar/:id",upload.single('imagen'),update);

/* ===========================================
            EN EL CONTROLLER
=========================================== */

   
    if (errors.isEmpty()) { //SI NO HAY ERRORES
      
    
        let producto = {
          id: productoparavista[productoparavista.length - 1].id + 1,
          nombre,
          imagen: req.file.filename,
        }
      }else { //SI HAY ERRORES
          if(req.file){ //Borro la imagen subida con multer
          let imgABorrar= path.join(__dirname, "../../public/images"+req.file.filename)
          fs.unlinkSync(imgABorrar) 
          }
         return res.render("cargadeproducto", { //Retorno nuevamente el formulario con los errores
            categorias,
            errores: errors.mapped(), 
            old: req.body // Recuerda los datos ya cargados en el body
          })
      }
      
/* ===========================================
            EN LA VISTA
=========================================== */
<form action="/productos/carga" method="POST" enctype="multipart/form-data" class="form"></form> 
{/*  Debe tener el enctype */ }

/* ===========================================
    VALIDANDO LA IMAGEN SUBIDA EN 
    EL ARCHIVO DE VALIDACIONES         
=========================================== */
{/* */}

body("imagen").custom((value, { req }) => {
    let file = req.file;

    let extensiones = [".jpg", ".png", ".img"];
    if (!file) {
      throw new Error("Tienes que subir una imagen");
    } else {
      let fileExtension = path.extname(file.originalname);
      if (!extensiones.includes(fileExtension)) {
        throw new Error(`Las extensiones de archivo permitidas son
                ${extensiones.join(", ")}`);
      }
    } return true;
  }) 

  /* =====================================================================================
   SUBIR MUCHAS IMAGENES CON MULTER      
=========================================================================================*/
//EN EL FORMULARIO DE LA VISTA
<form action="" method="POST" enctype="multipart/form-data">

<input type="file" class="form-control" id="productImagen" name="images" accept="image/*" multiple>
  {/* Muy importante que lleve el atributo multiple */}
   <span class="text-danger"><%= typeof error != 'undefined' ? error : null %> </span>

*/EN LA RUTA EN DONDE APLICO MULTER*/
router.post('/add', upload.array('images'), addProductValidator,save);
{/* Tiene que ser array no single */}

{/* EN EL METODO DEL CONTROLADOR EN DONDE CARGO LAS IMAGENES */} 

save : (req,res) => {
        let errors = validationResult(req);
        if(errors.isEmpty()){
            const {title, description,price,category} = req.body;
            if(req.files){ /* SI VIENE ALGO EN LAS IMAGENES */
                var imagenes = req.files.map(imagen => imagen.filename)
                /* VA 'FILES' NO FILE, EN LA VARIABLE IMAGENES GUARDO 
                SOLO EL NOMBRE DE LOS ARCHIVOS QUE ME LLEGAN */
            }
            let producto = {
                id : productos[productos.length - 1].id + 1,
                title,
                description,
                price : +price,
                images : req.files.length != 0 ? imagenes : ['default-image.png'],
               /*  Files.length porque es un array, y lleguen o no imagenes
               el array siempre existe */
                category
            }
           productos.push(producto);
    
           guardar(productos)
           return res.redirect('/')
        }else{
            return res.render('productAdd',{
                categorias,
                productos,
                errores : errors.mapped(),
                old : req.body
            })

        }

    {/* EN LA VISTA DETALLE DEL PRODUCTO */}

    <div class="col-7">
                    <div class="d-flex flex-wrap">
                      <div class="d-flex flex-column flex-wrap w-25">
                        <% producto.images.forEach((imagen,index) => { %>  
                          <img onclick="document.getElementById('img-principal').setAttribute('src','/images/<%=imagen%>')" src="/images/<%= imagen %>" class="w-100" alt="...">
                            {/* Cuando hago click sobre la imagen capturo el elemento con id 'img-principal' y con setAttribute le cambio la imagen */}
                        <% }) %>
                      </div>
                      <div class="box-img-principal w-75">
                        <img id="img-principal" src="/images/<%= producto.images[0] %>" class="img-fluid" alt="...">
                      </div>
                    </div>
                   
                  </div>
