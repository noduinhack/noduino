import React, { Component } from 'react'
import './Control.css'
import socketIOClient from "socket.io-client";
import logueo from '../server'
import warningIcon from "./warning-icon.png"
import PageFooter from "../pageFooter/PageFooter"
//import { Joystick } from 'react-joystick-component';

//import { relative } from 'path';

require('dotenv').config()
console.log(process.env.REACT_APP_API_URL)
const socket = socketIOClient(process.env.REACT_APP_API_URL)


export default class Control extends Component {
  constructor() {
    super();
    this.state = {
      boardReady: false,
      speed: 3,
      metal: false,
      mines: 0,
      time: 0,
      distancia: 0,
      recording: false
    };
    this.server = new logueo()
  }

  mines = 0
  distancia = 0
  time = 0
  medirDistancia;
  mineDetected = false
  mmedirDistanciaPad;
  primera = true
  recording


  componentDidMount() {

    document.addEventListener('keyup', this.stopPad)
    document.addEventListener("keydown", this.touch);
    console.log()

    socket.on("board ready", data => this.setState({ boardReady: data }));
    socket.on('metal detected', msg => {
      let metal = false
      console.log("minas", this.mines)
      if (msg === 1) {
        metal = true
        this.mineDetected = true
      }
      this.setState({
        ...this.state,
        metal,
      })
    })
  }

  touch = (e) => {
    switch (e.keyCode) {
      case 38:

        //ARRIBA
        if (this.primera) {
          this.primera = false
          socket.emit('keypress', 38)
          this.medirDistanciaPad = setInterval(() => {

            this.distancia++
          }, 100)
        }
        e.preventDefault()
        break;
      case 40:
        //ABAJO
        if (this.primera) {
          this.primera = false
          socket.emit('keypress', 40)
          this.medirDistanciaPad = setInterval(() => {
            this.distancia++
          }, 100)
        }
        e.preventDefault()
        break;
      case 37:
        //IZQUIERDA
        socket.emit('keypress', 37)
        break;
      case 39:
        socket.emit('keypress', 39)
        //DERECHA
        break;
      default:
        break;
    }

  }

  moveArdu = (val) => {
    if (val === 38 || val === 40) {
      this.medirDistancia = setInterval(() => {
        this.distancia++
      }, 100)
    }
    if (val === "stop") {
      clearInterval(this.medirDistancia)
    }


    socket.emit('keypress', val)
  }

  moveCam = (val) => {
    console.log(val)
    socket.emit("camServo", val)
  }

  stopPad = () => {

    this.primera = true
    clearInterval(this.medirDistanciaPad)
    socket.emit('keypress', 'stop')
  }

  speedArdu = (e) => {
    socket.emit("speed update", e.target.value)
    this.setState({
      ...this.state,
      speed: e.target.value
    })
  }

  initRecord = () => {
    console.log("Init Record")
    this.recording = setInterval(() => {
      this.time++
      if (this.mineDetected) {
        this.mines++
        this.mineDetected = false
      }
      this.setState({
        ...this.state,
        mines: this.mines,
        distancia: Math.floor(((this.distancia / 30) * 10)) / 10,
        time: this.time
      })
    }, 1000)

    this.setState({
      ...this.state,
      recording: true
    })
  }

  stopRecord = () => {
    //cada 30 es un metro
    clearInterval(this.recording)
    let distance = this.distancia / 30
    this.server.saveRoutes(this.mines, this.time, distance, this.props.match.params.id)
      .then(data => console.log(data))
      .catch(err => console.log(err))

    this.mines = 0
    this.distancia = 0
    this.time = 0

    this.setState({
      ...this.state,
      mines: this.mines,
      distancia: this.distancia,
      time: this.time,
      recording: false
    })
  }

  /*   handleMove = (e) => {
      console.log(e.direction.toLowerCase())
    }
  
    handleStop = (e) => {
      console.log(e.type)
    } */

  render() {
    return (
      <div>
        <div className="container">
          <div className="columns">
            <div className="column header-column">
              <h1 className="noduino-title">NODUINO</h1>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              {/* <p className="status">UGV status: <span id="norduino-status">{this.state.boardReady ? "connected" : "disconnected"}</span></p> */}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="columns">
            <div className="column section-column">
              <div className="direction">
                <h3 className="section-title">DIRECTION</h3>
                {/* <div className="controls">
                  <Joystick size={100} baseColor="rgba(244,122,35,0.5)" stickColor="#F47A23" move={this.handleMove} stop={this.handleStop}></Joystick>

                </div> */}
                <div className="controls">
                  <div className="controls-left">
                    <div className="control control-left"
                      onMouseDown={() => this.moveArdu(37)}
                      onMouseUp={() => this.moveArdu("stop")}
                      onTouchStart={() => this.moveArdu(37)}
                      onTouchEnd={() => this.moveArdu("stop")}></div>
                  </div>
                  <div className=" controls-up-down">
                    <div className="control control-up"
                      onMouseDown={() => this.moveArdu(38)}
                      onMouseUp={() => this.moveArdu("stop")}
                      onTouchStart={() => this.moveArdu(38)}
                      onTouchEnd={() => this.moveArdu("stop")}></div>
                    <div className="control control-down"
                      onMouseDown={() => this.moveArdu(40)}
                      onMouseUp={() => this.moveArdu("stop")}
                      onTouchStart={() => this.moveArdu(40)}
                      onTouchEnd={() => this.moveArdu("stop")}></div>
                  </div>
                  <div className="controls-right">
                    <div className="control control-right"
                      onMouseDown={() => this.moveArdu(39)}
                      onMouseUp={() => this.moveArdu("stop")}
                      onTouchStart={() => this.moveArdu(39)}
                      onTouchEnd={() => this.moveArdu("stop")}></div>
                  </div>
                </div>

              </div>
              <div className="speed">
                <h3 className="speed-title">SPEED: <span id="speed-value">{this.state.speed}</span></h3>

                <input id="speed" className="slider" type="range" min="1" max="3" value={this.state.speed}
                  onChange={this.speedArdu} />

              </div>
              <div className="record-button-container">
                <button
                  href="#"
                  className="record-button"
                  onClick={this.initRecord}
                  style={this.state.recording ? { display: "none" } : { display: "block" }}>RECORD PATH</button>

                <button
                  href="#"
                  className="record-button stop-record"
                  onClick={this.stopRecord}
                  style={this.state.recording ? { display: "block" } : { display: "none" }}>STOP RECORD & SEND</button>
              </div>
              <div className={this.state.metal ? "metal-detected-box detected" : "metal-detected-box "} >
                <div className="warning-container">
                  <img src={warningIcon} alt="" />
                </div>
                <div className="warning-text">
                  <h4>WARNING!!</h4>
                  <p>Metal detected</p>
                </div>
              </div>
            </div>
            <div className="column section-column">
              <div className="cam-container">
                <h3 className="section-title">LIVE CAM</h3>
                <div className="controls">
                  <div className="controls-left">
                    <div className="control control-cam-left"
                      onMouseDown={() => this.moveCam("left")}
                      onMouseUp={() => this.moveCam("stop")}
                      onTouchStart={() => this.moveCam("left")}
                      onTouchEnd={() => this.moveCam("stop")}></div>
                  </div>
                  <div className=" controls-cam-up-down">
                    <div className="control control-cam-up"
                      onMouseDown={() => this.moveCam("up")}
                      onMouseUp={() => this.moveCam("stop")}
                      onTouchStart={() => this.moveCam("up")}
                      onTouchEnd={() => this.moveCam("stop")}>
                    </div>
                    <div className="live-cam-container">
                      <img src="http://192.168.20.189:8080/stream.mjpg" alt=""></img>
                    </div>
                    <div className="control control-cam-down"
                      onMouseDown={() => this.moveCam("down")}
                      onMouseUp={() => this.moveCam("stop")}
                      onTouchStart={() => this.moveCam("down")}
                      onTouchEnd={() => this.moveCam("stop")}></div>
                  </div>
                  <div className="controls-right">
                    <div className="control control-cam-right"
                      onMouseDown={() => this.moveCam("right")}
                      onMouseUp={() => this.moveCam("stop")}
                      onTouchStart={() => this.moveCam("right")}
                      onTouchEnd={() => this.moveCam("stop")}></div>
                  </div>
                </div>
                <button
                  onClick={() => this.moveCam("center")}
                  className="snapshot-button">
                  <i className="fas fa-camera"></i> CENTER CAMERA
                </button>
              </div>

              <div className={this.state.recording ? "path-info visible" : "path-info"} >
                <ul>
                  <li>Distance: {this.state.distancia}m</li>
                  <li>Landmines detected: {this.state.mines}</li>
                  <li>Time elapsed {this.state.time}s</li>
                </ul>


              </div>
            </div>
          </div>
        </div>
        <PageFooter />

      </div>
    )
  }
}
