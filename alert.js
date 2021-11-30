const $2 = (id) =>document.getElementById(id);

$2("btn1").addEventListener("click", (e) => {
   e.preventDefault()
   Swal.fire("ejemplo basico");
    })

    $2("btn2").addEventListener("click", (e) => {
        e.preventDefault()
        Swal.fire({
            icon:'success',
            title:"mensaje",
            text:"texto de prueba"
        });
    })

   /*  type: error, succeess, warning,info, */

   $2("btn3").addEventListener("click", (e) => {
    e.preventDefault()
    Swal.fire({
       imageUrl:'/images/a33.jpg',
       imageHeight: 412
    });
})

$2("btn4").addEventListener("click", (e) => {
    e.preventDefault()
    Swal.fire({
      position: 'top-start',
      type:`success`,
      title:'en una posicion',
      showConfirmButton:false,
      timer: 2000
    });
})

/* Posiciones: top, top-StaticRange, top-end , center, center-start 
center-end, bottom, */

/* con Animation.css */
$2("btn5").addEventListener("click", (e) => {
    e.preventDefault()
    Swal.fire({
        title: 'Custom animation with Animate.css',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
})
})


$2("btn6").addEventListener("click", (e) => {
    e.preventDefault()
    Swal.fire({
      title:'cambiar fondo',
     width: 600,
     padding: '5em',
     background:'#fff url(/images/comics.jpg)',
     backdrop:`
     rgba(5, 5, 25, 0.4)
     url("https://sweetalert2.github.io/images/nyan-cat.gif")
    center left 
    no-repeat
    `
    });
})

$2("btn7").addEventListener("click", (e) => {
    e.preventDefault()
    Swal.mixin({
     input:'text',
     confirmButtonText:'Siguiente &rarr',
     showCancelButton:true,
     progressSteps: ['1', '2', '3']
    }).queue([
        {
            title:'pregunta 1',
            text: 'color favorito'
        },
        {
            title:'pregunta 2',
            text: 'animal favorito'
        },
        {
            title:'pregunta 3',
            text: 'cancion favorita'
        }
    ]).then((result) =>{
        if(result.value){
            Swal.fire({
                title: 'Completo',
                html: 
                `tus respuestas: <pre><code>`+
                JSON.stringify(result.value) +
                `</code></pre>`,
                confirmButtonText: 'OK'
            })
        }
    })
})


/*   codigo real0000000000000000000000000 */

document.querySelector(".deslogueado").addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
        type:'success',
        title:"Logueo",
        text:"Debes estar logueado para poder realizar la compra"
    });
    })

     /* ============sweetalert2============  */

   /*  <div class="container">
     <div class="row">
       <div class="col-lg-3">
         <button id="btn1" class="btn btn-autline-primary btn-lg btn-block">Basico</button>
         <button id="btn2" class="btn btn-autline-secondary btn-lg btn-block">Tipos de Popup</button>
       </div>
        <div class="col-lg-3">
         <button id="btn3" class="btn btn-autline-sucess btn-lg btn-block">Con imagenes</button>
         <button id="btn4" class="btn btn-autline-danger btn-lg btn-block">Con Posicion</button>
       </div>
        <div class="col-lg-3">
         <button id="btn5" class="btn btn-sucess btn-lg btn-block">Animado</button>
         <button id="btn6" class="btn btn-primary btn-lg btn-block">Cambiando el fondo</button>
       </div>
      <div class="col-lg-3">
         <button id="btn7" class="btn btn-info btn-lg btn-block">Progresivo</button>
         <button id="btn8" class="btn btn-danger btn-lg btn-block">Timer</button>
       </div>




     </div>



    </div> */
   
     /*  ============sweetalert2============  */

     const borrar = async () => {
        let borrar = document.querySelectorAll('.borrar')
       
         borrar.forEach(e => e.addEventListener("click",(event)=>{
          event.preventDefault()
          let formulario = document.querySelector('.eliminar')  
      
          Swal.fire({
            title: 'Seguro que queres eliminar este producto?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, quiero eliminarlo!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
              formulario.submit()
            }
          })
        })) 
      }
      
      const borrar = async () => {
        let formularios = document.querySelectorAll(".eliminar");

        formularios.forEach((e) =>
          e.addEventListener("submit", (event) => {
            event.preventDefault();
            console.log("hola");

            Swal.fire({
              title: "Seguro que queres eliminar este producto?",
              text: "Ya no podras revertir este cambio!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Si, quiero eliminarlo!",
            }).then((result) => {
              console.log(result);
              if (result.isConfirmed) {
                Swal.fire(
                  "Borrado!",
                  "El producto a sido eliminado",
                  "success"
                );
                e.submit();
              }
            });
          })
        );
      };

      document.querySelector(".deslogueado").addEventListener("click", (e) => {
        e.preventDefault();
        Swal.fire({
          icon: "info",
          title: "Debes estar logueado para poder realizar la compra",
          confirm: false,
          timer: 2000,
        });
      });