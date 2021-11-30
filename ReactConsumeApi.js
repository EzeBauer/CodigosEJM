import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Gif extends Component {
  //1-Empiezo un estado con un gif vacio
  constructor(props) {
    super(props);
    this.state = {
      gif: "",
    };
  }
  //4- apiCall se encarga de resolver un pedido por Api
  apiCall(url, consecuencia) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => consecuencia(data))
      .catch((error) => console.log(error));
  }

  //2- Despues de renderizar se monta y tre un gif nuevo

  componentDidMount() {
    console.log("Me monte!");
    this.traerGifNuevo();
  }
  //3- traerGifNuevo llama a una apiCall (que se encarga de resolver un pedido por Api)
  //y luego ejecuta mostrarGif (que cambia el estado)
  traerGifNuevo() {
    this.apiCall("empoint...", this.mostrarGif);
  }
 //5-mostrarGif al cambiar el estado vuelve a ejecutar render
 //Cuando se utiliza setState necesitamos que sea una arrow function
  mostrarGif = (data) => {
    this.setState({
      gif: data.data.image_url, //ubicacion en la api en donde se encuentra la URL de la imagen
    });
  };

  componentDidUpdate() {
    console.log("Me actualice!");
    alert("Tengo un nuevo Gif");
  }

  render() {
    console.log("Estoy renderizando");

    let contenido;
//cargando se ejecuta hasta que carga el gif (milesimas de segundo)
    if (this.state.gif === "") {
      contenido = <p>Cargando...</p>;
    } else {
      contenido = <img src={this.state.gif}></img>;
    }

    return (
      <div>
        {contenido}
        <button onClick={() => this.traerGifNuevo()}>Randon Gif!</button>
          </div>
    );//Al hacer click vuelve a ejecutar pedido a la api, vuelve a actualizar estado
    //y muestra un gif nuevo
  }
}

export default Gif;
