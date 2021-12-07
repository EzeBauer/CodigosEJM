const path = require("path");
const bcryptjs = require("bcryptjs"); //para encriptar el password- que sea brcyptjs
const fs = require("fs");
const { validationResult } = require("express-validator");
const db = require('../database/models');


module.exports = {
 
  login: (req, res) => {
    return res.render("login");
  },
  processLogin: (req, res) => {
    
    let resultadoValidacion = validationResult(req);
    const { email } = req.body;

    if(resultadoValidacion.isEmpty()){
      db.User.findOne({
        where:{
            email
        }
    }).then(user=>{
      req.session.userLogin = {
        id : user.id,
        name : user.nameUser,
        avatar:user.avatar,
        rol:user.rol,
        email:user.email,

      }
      let on = req.body.recordar;
     if (on) {
      res.cookie("userLogin", req.session.userLogin, { maxAge: 120000 });
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

      /* return res.redirect("/users/perfil"); */
    })
    }else {
      return res.render("login", {
        errors: resultadoValidacion.mapped(),
        old: req.body,
      });
    } 
  },
  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie('userLogin');
    res.redirect("/");
  },
 
  
}


//00000000000000000000000000000 RUTAS 0000000000000000000000000000000000000000000000000

const express = require("express");
const router = express.Router();


const checkLogin = require('../middlewares/checkLogin');
const validLogin = require('../validations/validLogin');

const {
 login,
 
 processLogin,
 logout 
} = require("../controllers/usersController");

/* /users */
router.get("/login", checkLogin,login);
router.post("/login",validLogin,processLogin);
router.get("/logout", logout);   // en la vista <a class="dropdown-item" href="/users/logout">Cerrar sesion</a>


module.exports = router;


//0000000000000000000000000000000 middleware- checkLogin 0000000000000000000000

function checkSession(req,res,next) {
    if (req.session.userLogin) {
        return res.redirect('/')
    } else {
        next()
    }
}

module.exports= checkSession;

//0000000000000000000000000000000 validacion 000000000000000000000000000000000000
const {body, check} = require('express-validator');
const db = require('../database/models');
const bcrypt = require('bcryptjs');


module.exports = [
    body('email')
    .custom((value,{req}) => {
        console.log(value)
       return db.User.findOne({
            where:{
                email: value
            }
        }).then(user =>{
            console.log('email user: ',user.email);
            if (!user || !bcrypt.compareSync(req.body.password,user.password)) {
               return Promise.reject()
            }
        }).catch(()=>Promise.reject('Credenciales inválidas'))
   
    })
]


//000000000000000000000000000000000 js Front- validateLogin 00000000000000000000000000

(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

  //00000000000000000000000000000000 Vista Formulario login 0000000000000000000000000000

  <!DOCTYPE html>
<html lang="en">
<%- include('./partials/head') %>

  <body class="login">
    <h1 class="titulo">Login</h1>
    <main class="login-main">

      <form action="/users/login" method="POST" class="inputs needs-validation" novalidate> 
        <h4 class="ingresa-google">Ingresar</h4>
        <div>
          <input type="text" id="validationCustom01" class="form-control" name="email" placeholder="Email" required/>
        </div>
        <div>
          <input type="password" id="validationCustom02" name="password" class="form-control" placeholder="Contraseña" required />
        </div>
        <span class="text-danger fs-4"><%= locals.errors && errors.email ? errors.email.msg :null%></span>
        <div class="recordarme">
          <input type="checkbox" name="recordar" id="recordarme" />
          <label for="recordarme">Recordarme</label>
        </div>
        <p class="recuperar-cont">
          tus credenciales fueron robadas por hydra?...
          <a href="#">Recuperalas</a>
        </p>
        <button class="btn-ingresa">INGRESA</button>
      </form>
      </section>
      <div class="pruebass">
        <a href="/" class="cont-img">
          <img src="/images/torre.png" alt="logo-torre" />
        </a>
      </div>
    </main>
    <script src="/javascript/validateLogin.js"></script>
  </body>

</html>