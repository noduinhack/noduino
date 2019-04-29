import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";

const socket = socketIOClient(process.env.REACT_APP_API_URL)
export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      boardReady: false,
      speed: 3,
      metal: false,
    };

  }


  recorrido = []
  top = 250
  left = 250
  widthNodu = 50
  heightNodu = 50
  tiempoIzd = 0;
  izqInterval;



  touch = (e) => {
    switch (e.keyCode) {
      case 38:
        this.recorrido.push(e.keyCode)
        //ARRIBA
        socket.emit('keypress', 38)
        this.top -= 5
        break;
      case 40:
        //ABAJO
        this.recorrido.push(e.keyCode)
        socket.emit('keypress', 40)
        this.top += 5
        break;
      case 37:
        //IZQUIERDA
        this.recorrido.push(e.keyCode)

        socket.emit('keypress', 37)




        break;
      case 39:

        socket.emit('keypress', 39)
        this.recorrido.push(e.keyCode)
        //DERECHA
        break;
      default:
        break;
    }

  }

  mostrarRecorrido = () => {
    console.log(this.recorrido)
  }

  canvas = () => {
    var canvas = document.getElementById('canvas')
    canvas.width = 600;
    canvas.height = 600

    let ctx = canvas.getContext("2d")
    canvas.style.background = "green"
    ctx.fillStyle = "blue";
    setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(this.left, this.top, this.widthNodu, this.heightNodu);
      // Restore the transform
    }, 100)
  }

  repetir = (parcela) => {
    this.left = 0;
    this.top = 0;

    var num = 0
    var longitud = this.recorrido.length

    let repetir = setInterval(() => {
      let formateo = {
        keyCode: this.recorrido[num]
      }

      this.touch(formateo)
      num++
      if (num === longitud) clearInterval(repetir)
    }, 10)
  }




  componentDidMount() {
    document.addEventListener('keyup', () => {
      console.log("STOP")
      clearInterval(this.izqInterval)
      socket.emit('keypress', 'stop')
    })
    document.addEventListener("keydown", this.touch, false);
    this.canvas()
    socket.on("board ready", data => this.setState({ boardReady: data }));
    socket.on('metal detected', msg => {
      let metal = false
      if (msg === 1) metal = true

      this.setState({
        ...this.state,
        metal
      })
    })

  }

  stop = () => {
    socket.emit('keypress', 'stop')
  }

  // 37 -> IZQUIERDA
  // 38 -> ARRIBA
  // 39 -> DERECHA
  // 40 -> ABAJO

  parcela = () => {

    // let array = [38, 38, 38, 38, 38]
    // this.repetir(array)


    var canvas = document.getElementById('canvas')
    canvas.width = 600;
    canvas.height = 600
    // let m2 = document.getElementById('metros').value
    canvas.style.background = "white"
    //let segundosMetros = 3000;
    let velocidad = canvas.width / 300
    //let limite = 50
    var num = -1
    var parar = false

    // setInterval(()=>{
    //   segundos++
    //   console.log(segundos)
    // },1000)
    setInterval(() => {


      // 37 -> IZQUIERDA
      // 38 -> ARRIBA
      // 39 -> DERECHA
      // 40 -> ABAJO

      if (!parar) { this.top += num }

      if (this.top === 0) {
        console.log("ESTOY ARRIBA")


        parar = true
        this.top = this.top + 1
        setTimeout(() => {

          setInterval(() => {


            this.left++

          }, 10)
        }, 500)


        // this.left += 50
        // num = +velocidad


      } else if (this.top + this.heightNodu === canvas.width) {
        console.log("ESTOY ABAJO")
        this.left += 50
        num = -velocidad

      }
    }, 1000 / 60)
  }

  rastreo = () => {
    console.log("Rastreo")
    socket.emit('autopath', 35)


  }



  render() {

    return (
      <div>
        <Link to="/" >HOME</Link>
        <h1>Profile</h1>
        <div id="container">
          <canvas id="canvas" ref="canvas" />
          <div>
            <button id="botonRecorrido" onClick={this.mostrarRecorrido}>Imprimir Recorrido</button>
            <button id="rastreo" onClick={this.rastreo}>Rastreo Zona</button>
            <p id="recorrido"></p>
            <button id="repetir" onClick={this.repetir}>Repetir recorrido</button>
            <br />
            <p>M2: <input id="metros" type="number" /></p>

            <button id="recorrerParcela" onClick={this.parcela}>Recorrer Parcela</button>
            <button id="stop" onClick={this.stop}>STOP</button>
          </div>
        </div>
      </div>
    )
  }
}


