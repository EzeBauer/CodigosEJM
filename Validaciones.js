//1- Instalar Express Validator
npm i express-validator

/*==================================================
2- EN LA CARPETA VALIDACIONES, EN UN ARCHIVO 
====================================================*/
const { body, check } = require("express-validator");
const path = require('path');


module.exports = [ //Creamos un array de validaciones y lo exportamos
    check("nombre")
        .notEmpty().withMessage("El nombre es obligatorio").bail()
        .isLength({
            min: 2,
            max: 50,
        }).withMessage("El nombre tiene que tener como mínimo 2 caracteres"),

    //en el chequeo custon, le pasamos por argumento "value" (hace referencia
    //al value del campo que estamos chequeando, y a lo que se recibio por req

    body("imagen").custom((value, { req }) => {
        let file = req.file;

        let extAceptadas = [".jpg", ".png", ".img"];
        if (!file) {
            throw new Error("Tienes que subir una imagen");
        } else {
            let fileExtension = path.extname(file.originalname);
            if (!extAceptadas.includes(fileExtension)) {
                throw new Error(`Las extensiones de archivo permitidas son
                ${extensiones.join(", ")}`);
            }
        } return true;
    }),

    check("precio")
        .notEmpty().withMessage("Debes completar el precio"),

    check("marca")
        .notEmpty().withMessage("Debes indicar la marca"),

    check("descripcion")
        .notEmpty()
        .withMessage("Debes completar la descripción del producto"),

    check("categoria").notEmpty().withMessage("Debes elegir la categoria"),
];

/*==================================================================
3- EN LA RUTA QUE PROCESA EL FORMULARIO: LO AGREGAMOS COMO MIDDLEWARE  
====================================================================*/

let validarCarga = require('../validations/validCarga')

router.post("/carga", upload.single("imagen"), validarCarga, create);


/*============================================================================
 4- EN EL METODO DEL CONTROLADOR : VERIFICAR SI HUBO ERRORES EN LA VALIDACION
 ============================================================================ */
const { validationResult } = require("express-validator");



create: (req, res) => {
    let errors = validationResult(req);
/* Guardamos en la variable errors, la ejecucion del metodo validationResult,
pasandole como parametro el objeto request */
    let { nombre, precio, marca, descripcion, categoria } = req.body;
    
    if (errors.isEmpty()) {
        /*  El metodo isEmpty() nos permite saber si hay errores de validacion o no  */
        /*  Si no hay errores, seguimos con la accion que deba realizar el controlador
         por ejemplo, cargar un nuevo producto */
        let producto = {
            id: productoparavista[productoparavista.length - 1].id + 1,
            nombre,
            imagen: req.file.filename,
            precio: +precio,
            marca,
            descripcion,
            categoria,
        };

        productoparavista.push(producto);
        guardar(productoparavista);

        return res.redirect("/productos");
    } else { //si hay errores, volvemos al formulario mostrando los errores del usuario
        if (req.file) {
            let imgABorrar = path.join(__dirname, "../../public/images/merchandinsing/" + req.file.filename)
            fs.unlinkSync(imgABorrar)
        }
        return res.render("cargadeproducto", {
            categorias,
            errores: errors.mapped(),
            /*   El metodo mapped nos permite enviar los errores a la vista como un objeto
              Ese objeto contendra una propiedad con el primer error de cada campo */
            old: req.body //enviamos los datos que el usuario ya cargo en el objeto "old",
            //para que no tenga que cargar todo nuevamente
        })

    }

}

 /*====================================================
   5- MOSTRAR LOS ERRORES EN LA VISTA 
   ===================================================*/

 <input type="text" id="nombreProducto" name="nombre" placeholder="Nombre de Producto"
     value="<%=locals.old && old.nombre? old.nombre :null %>">
{/* Dentro del value, si old existe y se el campo "nombre" se lleno, que me lo traiga */}

    <span class="error-carga"><%= locals.errores && errores.nombre ? errores.nombre.msg : null %></span>
{/* para evitar problemas en un if ternario debemos preguntar si la variable errores existe antes de
intentar mostrar un error. Si hay un error en el campo, que me muestre el msg de error */}

{/* MOSTRAR ERRORES EN UN SELECT */}

<select name="categoria">
    <option value="" selected hidden>Seleccione la categoría</option>
     <% categorias.forEach(rubro => { %>
    <option value="<%= rubro %>"<%= locals.old && old.categoria===rubro ? 'selected' :null%> ><%= rubro %></option> 
    <% }) %>
    </select>
                  
    <span class="error-carga"><%= locals.errores && errores.categoria ? errores.categoria.msg : null %></span>

{/* MOSTRAR ERRORES EN UN TEXTAREA */}
<label for="descripcion">Descripción del producto</label>
 <textarea name="descripcion" id="descripcion" cols="8" rows="3" placeholder="Escribir..." ><%= locals.old && old.descripcion ? old.descripcion : null %></textarea>
 <span class="error-carga"><%= locals.errores && errores.descripcion ? errores.descripcion.msg : null %></span>