
//00000000000000000000000000 CONTROLLER 000000000000000000000000000000000000000000000

const path = require("path");
const bcryptjs = require("bcryptjs"); //para encriptar el password- que sea brcyptjs
const fs = require("fs");
const { validationResult } = require("express-validator");
const db = require('../database/models');


module.exports = {
  registro: (req, res) => {
    return res.render("registrarse");
  },
  procesarRegistro: (req, res) => {
    let resultadoValidacion = validationResult(req);
    let {nameUser,firstName,password,email,lastName}=req.body
    if (resultadoValidacion.isEmpty()) {

      db.User.create({
        nameUser:nameUser.trim(),
        firstName:firstName.trim(),
        lastName:lastName.trim(),
        email:email.trim(),
        password : bcryptjs.hashSync(req.body.password,10),
        avatar: req.file ? req.file.filename : req.body.nameUser[0].toUpperCase()+".jpg",
        rol:'usuario'
      }).then(user => {
        req.session.userLogin = {
            id : user.id,
            name : user.nameUser,
            avatar:user.avatar,
            rol:user.rol
        }
          //CARRITO//
     req.session.cart = [];

     db.Order.findOne({
       where: {
         userId: req.session.userLogin.id,
         status: "pending",
       },
       include: [
         {
           association: "carts",
           include: [
             { association: "product", include: ["category"] },
           ],
         },
       ],
     })
       .then((order) => {
         if (order) {
           order.carts.forEach((item) => {
             let product = {
               id: item.productId,
               nombre: item.product.title,
               imagen: item.product.image,
               categoria: item.product.category.name,
               cantidad: item.quantity,
               precio: item.product.price,
               total: item.product.price * item.quantity,
               orderId: order.id,
             };
             console.log(product);
             req.session.cart.push(product);
           });
         }
         return res.redirect("/users/perfil");
       })
       .catch((error) => console.log(error));

      //FIN DE CARRITO//
        return res.redirect('/')
      }).catch(error => console.log(error))
    } else {
       return res.render("registrarse", {
         errors: resultadoValidacion.mapped(),
         old: req.body,
       });
     }
     
  },


  //000000000000000000000000000000000000000  RUTAS 000000000000000000000000000000000

  const express = require("express");
const router = express.Router();

const validarRegistro = require('../validations/validRegistro')

const passMiddleware = require('../validations/passMiddleware');


const {
 login,
 registro,
 procesarRegistro,
 processLogin,
 logout,
 perfil,
 destroy,
 updatePass,
 updateAvatar
} = require("../controllers/usersController");


const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/users"); //Indica en donde se va a guardar la imagen
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
    //indica el nombre del archivo. path.extname(extrae la extension del archivo(de su nombre original))
  },
});
const avatar = multer({ storage });

/* /users */

router.get("/registro",checkLogin, registro);
router.post(
  "/registro",
  avatar.single("imagenUsuario"),
  validarRegistro,
  procesarRegistro
);


module.exports = router;


//000000000000000000000000000  VALIDACION REGISTRO 00000000000000000000000000000000000000

const { body, check } = require("express-validator");
const path = require('path');
const db = require('../database/models')
let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;



module.exports = [
  check("nameUser")
    .notEmpty()
    .withMessage("El Campo es obligatorio")
    .bail()
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("El nombre tiene que tener como mínimo 2 caracteres"),

  check("password")
    .notEmpty()
    .withMessage("Tienes que colocar una contraseña")
    .bail(),
    
    body('password')
    .custom(value => {
      console.log(value);
      if (!regExPass.test(value)){
        throw new Error("La contraseña debe tener como minimo 8 caracteres, una mayúscula y numeros");
      }else{
        return true
      }
      
    }),

    check("firstName")
    .notEmpty()
    .withMessage("Debes colocar tu nombre")
    .bail()
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("El nombre tiene que tener como mínimo 2 caracteres"),

    check("lastName")
    .notEmpty()
    .withMessage("Debes colocar tu apellido")
    .bail()
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("El apellido tiene que tener como mínimo 2 caracteres"),

  check("email")
    .notEmpty()
    .withMessage("Debes colocar tu email")
    .bail()
    .isEmail()
    .withMessage("Tiene que tener formato de email"),

    body('email')
    .custom(value => {
        return db.User.findOne({
            where : {
                email : value
            }
        }).then(user => {
            if(user){
                return Promise.reject('El email ya está registrado')
            }
        })
    }),

  body("imagenUsuario").custom((value, { req }) => {
    let file = req.file;

    let extensiones = [".jpg", ".png", ".img"];
    if (file) {
      let fileExtension = path.extname(file.originalname);
      if (!extensiones.includes(fileExtension)) {
        throw new Error(`Las extensiones de archivo permitidas son
                ${extensiones.join(", ")}`);
      }
    }
    return true;
  }),
];


//0000000000000000000000000000 VISTA FORMULARIO REGISTRO 00000000000000000000000000000

<!DOCTYPE html>
<html lang="en">
<%- include('./partials/head') %>

  <body class="registro-body">
    <div class="tituloSubtitulo">
    <h1 class="titulo">Sumate a nuestra comunidad para poder disfrutar nuestros beneficios</h1>
    <div class="p-margin-top container subtitulo">
      <p>Comprar en nuestro sitio,
      Enterarte novedades,
      Sorteos y Descuentos Exclusivos
      y más...</p>
    </div>
  </div>

    <main class="registro">
      <section class="logo-info">
        <div class="intento"><a href="/users/login">
          <img src="/images/torre.png" alt="logo-torre" /></a>
        </div>
        </div>
      </section>
      <section class="registrarse">
        <form action="" method="POST" id="form-register" class="needs-validation inputs" enctype="multipart/form-data" novalidate>
          
          <div class="container">
            
          <div class="cont-input">
            <input type="text" id="validationCustom01" class="form-control" name="nameUser" placeholder="Nombre de usuario" value="<%=locals.old && old.nameUser? old.nameUser :null %>" required/>
            <span class="alerta"><%= locals.errors && errors.nameUser ? errors.nameUser.msg : null %></span>
          <div class="invalid-feedback  error-nameUser"> </div>
          </div>

          <div class="cont-input">
            <input type="text" id="validationCustom02" class="form-control" name="firstName" placeholder="Nombre" value="<%=locals.old && old.firstName? old.firstName :null %>" required/>
           <span class="alerta"><%= locals.errors && errors.firstName ? errors.firstName.msg : null %></span>
           <div class="invalid-feedback error-firstName"> </div>
          </div>

          <div class="cont-input">
            <input type="text" id="validationCustom05" class="form-control" name="lastName" placeholder="Apellido" value="<%=locals.old && old.lastName? old.lastName :null %>" required/>
           <span class="alerta"><%= locals.errors && errors.lastName ? errors.lastName.msg : null %></span>
           <div class="invalid-feedback error-lastName"> </div>
          </div>

          <div class="cont-input">
            <input type="email" id="validationCustom03" class="form-control" name="email" placeholder="Email" value="<%=locals.old && old.email? old.email :null %>" required/>
           <span class="alerta"><%= locals.errors && errors.email ? errors.email.msg : null %></span>
            <div class="invalid-feedback error-email"> </div>
          </div>

          <div class="cont-input">
            <input type="password" id="validationCustom04"class="form-control"  name="password" placeholder="Contraseña" required/>
           <span class="alerta"><%= locals.errors && errors.password ? errors.password.msg : null %></span>
            <div class="invalid-feedback error-password"> </div>
          </div>
        </div>
        <div class="error-empty cont-input text-danger"></div>

        <div class="container-button">
          <button type="submit" class="btn-registrarse">REGISTRARSE</button>

        </div>
        </form>
        <div class="cont-logueate">
          <h2 class="logueate">
            Si ya tenes Cuenta
            <a href="/users/login">Logueate</a>
          </h2>
        </div>
      </section>
    </main>
    <script src="/javascript/validateFormRegister.js"></script>
  </body>

</html>

// 0000000000000000000000 javascript front- validateFormRegister 00000000000000000000000000000

let regExEmail =  /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;

console.log('CONECTADO');

let form = document.querySelector("form")
let nameUser = document.querySelector("#validationCustom01")
let firstName = document.querySelector("#validationCustom02")
let lastName = document.querySelector("#validationCustom05")
let email = document.querySelector("#validationCustom03")
let password = document.querySelector("#validationCustom04")
let buttom = document.querySelector(".btn-registrarse")


// API emails

const fetchEmail = async () => {
    try {
        let res = await fetch('/api/users/email')
        let data = await res.json()
        return data.email;
        
    } catch (error) {
        console.log(error);
    }
}

// validaciones 

nameUser.addEventListener('input', ()=>{
    if(nameUser.value.length < 2){
        nameUser.classList.add('is-invalid')
        document.querySelector('.error-nameUser').innerHTML = "Debes ingresar un nombre de usuario válido"
    }else{
       nameUser.classList.remove('is-invalid')
       nameUser.classList.add('is-valid')
        document.querySelector('.error-nameUser').innerHTML = null
    }
})

firstName.addEventListener('input', ()=>{
    if(firstName.value.length < 2){
        firstName.classList.add('is-invalid')
        document.querySelector('.error-firstName').innerHTML = "Debes ingresar un nombre de usuario válido"
    }else{
       firstName.classList.remove('is-invalid')
       firstName.classList.add('is-valid')
        document.querySelector('.error-firstName').innerHTML = null
    }
})
lastName.addEventListener('input', ()=>{
    if(lastName.value.length < 2){
        lastName.classList.add('is-invalid')
        document.querySelector('.error-lastName').innerHTML = "Debes ingresar un nombre de usuario válido"
    }else{
       lastName.classList.remove('is-invalid')
       lastName.classList.add('is-valid')
        document.querySelector('.error-lastName').innerHTML = null
    }
})

password.addEventListener('input', ()=>{
    if(!regExPass.test(password.value) ){
        password.classList.add('is-invalid')
        console.log(password.value);
        document.querySelector('.error-password').innerHTML = "Debe tener entre <strong>8</strong> y <strong>12</strong> caracteres 1 <strong>Número</strong> y 1 <strong>Mayúscula</strong>"
    }else{
       password.classList.remove('is-invalid')
       password.classList.add('is-valid')
        document.querySelector('.error-password').innerHTML = null
    }
})

email.addEventListener('input',async ()=>{

    if(!regExEmail.test(email.value)){
        email.classList.add('is-invalid')
        document.querySelector('.error-email').innerHTML = "Debes ingresar un email válido"
    }else {
        let emails = await fetchEmail()
        let result;
         emails.forEach(element => {
            if(email.value === element){
                result = true
            }else{
                result=false
            }
         });
        console.log(result);
        if (result) {
            email.classList.add('is-invalid')
            document.querySelector('.error-email').innerHTML = "El email ya existe"
        }else{
            email.classList.remove('is-invalid')
            email.classList.add('is-valid')
            document.querySelector('.error-email').innerHTML = null
        }
    }
})



form.addEventListener("submit", e =>{
    e.preventDefault()
    let error = false;
    let elementosForm = form.elements

    for (let i = 0; i < elementosForm.length - 1; i++) {
        
        if(!elementosForm[i].value){
            elementosForm[i].classList.add('is-invalid')
            document.querySelector('.error-empty').innerHTML = 'Los campos señalados son obligatorios';
            error = true
        }
     
    }
    if(!error){
        form.submit()
    }
 

})

