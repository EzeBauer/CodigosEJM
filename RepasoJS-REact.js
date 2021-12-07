onst getUser = () => { // Si coloco llaves necesito un return
  return{
    id: 'asd123',
    name:'Guillermo'
  }
}

//Forma de poner la funcion entre parentesis
const getUser = () => ({
    id: "asd123",
    name: "Guillermo",
  })


const miNombre= () => console.log('Eric') //return implicito

miNombre()

console.log(getUser())


const persona={
  nombre:"Tony",
  edad:45,
  clave:'Iroman'
}

const nombre = 'Elvis'

//=================DESTRUCTURACION==============================

const {nombre: heroe, edad, clave} = persona //la propiedad nombre toma el nombre heroe
//porque la const nombre ya esta declarada.

console.log(nombre)// Elvis
console.log(heroe)//Tony

const retornaPersona =(persona) => {
  const {nombre: heroe, edad, clave} = persona //Destructuramos dentro de la funcion
  console.log(heroe, edad, clave);
}

retornaPersona(persona)//Me devuelve los valores de las propiedades por separado

const retornaPersona2 = ({ nombre, edad, rango='capitan' }) => { //destructuro en los parametros. 
  //Le asigno un valor por defecto a la propiedad rango por si no viene ningun valor
 
  console.log(nombre, edad, rango); 
};
retornaPersona2(persona) //devuelve Tony 45 capitan


const persona = {
  nombre: "Tony",
  edad: 45,
  clave: "Iroman",
};

const use_Context =({edad, clave, rango='soldado'}) => ( //como voy a devolver un objeto coloco parentesis
  {
    nombreClave: clave,
    anios: edad,
    latlog: {
      lat:1456,
      log:1234
    },
    rango
  }
)

const avenger = use_Context(persona)
console.log(avenger) //Devuelve las propiedades destructuradas.

//======Desestructuracion de arreglos o arrays=================

const heroes =['Batman', 'Iroman','Wonderwoman']

console.log(heroes[0]) //Batman

const [heroe1, heroe2, heroina]=heroes

console.log(heroina)//Wonderwoman

const retornaArray =() => {
  return ['ABC', 123]
}
console.log(retornaArray()) // me retorna el arreglo

const [letras, numeros]= retornaArray()

console.log(letras, numeros)// ABC, 123

const use_State = (valor) => {
  return [valor, ()=> console.log('Hola Mundo!!')] //retorna un valor y una funcion
}

const array = use_State('chapulin') //Me devuelve el valor que le pase ('chapulin') y una funcion

console.log(array[0]) //chapulin
console.log(array[1]) //Me devuelve el valor sin ejecutar
array[1](); //Me devuelve la funcion ejecutada ('hola mundo')

const [state, setState] = use_State('');

setState() //devuelve 'Hola Mundo!'


const apiKey ='qkmDFGEkjkjkjdasdakjj48464'

const peticion = fetch(
  `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`
);

peticion
  .then((response) => response.json())
  .then(({ data }) => {
    const { url } = data.images.original;

    const img = document.createElement("img");
    img.src = url;
    document.body.append(img);
  });


 /*  const getImage= async()=> {
    try{

    }catch(error){
      console.log(error)
    }
  } */

  const activo = true
  let mensaje;

  if(activo){
    mensaje= 'Active'
  }else{
    mensaje= 'Inactivo'
  }

  const mensaje2 = activo ? 'activo': 'inactivo'; //if ternario
  console.log(mensaje2)

  const mensaje3= activo && 'activo!!' //if abreviado si activo es true devolve activo!!

  ===================================================================================
                EN archivo heroes.js
  ===================================================================================

  const heroes = [
    {
        id: 1,
        name: 'Batman',
        owner: 'DC'
    },
    {
        id: 2,
        name: 'Spiderman',
        owner: 'Marvel'
    },
    {
        id: 3,
        name: 'Superman',
        owner: 'DC'
    },
    {
        id: 4,
        name: 'Flash',
        owner: 'DC'
    },
    {
        id: 5,
        name: 'Wolverine',
        owner: 'Marvel'
    },
];

export const owners = ['DC', 'Marvel']

export default heroes;

//En otro archivo

import Personajes from './heroes' // me trae el arreglo de 5 heroes
//cuando importo por defeto no necesito llamarlo con el mismo nombre con el que fue exportado

import heroes, {owners} from "./heroes"; 
console.log(owners)//array ['DC', 'Marvel']


//============== Promesas==========================

import {getHeroeById} from './functions'

/* ========================================================
archvio functions.js
======================================================= */
import heroes from "./heroes";

export const getHeroeById = (id) => heroes.find((heroe) => heroe.id === id);

/* ==================================================================
Fin archivo functions 
================================================================== */



const promesa - new Promise((resolve, reject)=>{
    setTimeout(() => {

    const heroe = getHeroeById(3)
    resolve(heroe)
    reject('No se encontro el heroe') //rechazo de la promesa
    }, 2000)
})



promesa.then( (heroe)=> {
    console.log(heroe)  //object [id:3, name:'superman']
})
.catch(error => console.log(error))

/* const getHeroeByIdAsync= id =>{
    return new Promise((resolve, reject) =>{
        setTimeout(()=> {
            const heroe= getHeroeById(id)

            if(heroe){
                resolve(heroe)
            } else{
                reject('No se encontro el heroe')
            }
        },2000)
    })
}

getHeroeByIdAsync(30)
.then(heroe =>console.log(heroe))
.catch(err => console.log(err)) */


import { getHeroeById } from './functions';

const getHeroeByIdAsync = id => {

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const heroe = getHeroeById(id);

      if (heroe) {
        resolve(heroe);
      } else {
        reject('No se el encontró el héroe')
      }

    }, 2000)
  })

}

getHeroeByIdAsync(30)
  .then(heroe => console.log(heroe))
  .catch(err => console.log(err))











