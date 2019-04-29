import React, { Component } from 'react'
import './ControlIpad.css'
import socketIOClient from "socket.io-client";
import logueo from '../server'
import warningIcon from "./warning-icon.png"
import PageFooter from "../pageFooter/PageFooter"
import { Joystick } from 'react-joystick-component';

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
  primera = true
  currentMov = ""
  localIP = ""
  recording


  componentDidMount() {

    document.addEventListener('keyup', this.stopPad)
    document.addEventListener("keydown", this.touch);
    console.log()

    socket.on("board ready", data => this.setState({ boardReady: data }));
    socket.on("local ip", data => {
      this.localIP = data
      console.log(`local ip is ${this.localIP}`)
    })
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

    setInterval(() => {
      if (this.recording && (this.currentMov === "forward" || this.currentMov === "backward")) {
        this.distancia++
      }
    }, 100)
  }

  touch = (e) => {
    switch (e.keyCode) {
      case 38:
        //ARRIBA
        if (this.primera) {
          this.primera = false
          socket.emit('keypress', 38)
          this.medirDistanciaPad = setInterval(() => {
            if (this.recording) this.distancia++
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
            if (this.recording) this.distancia++
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
      case 87:
        socket.emit("camServo", "up")
        break
      case 83:
        socket.emit("camServo", "down")
        break
      case 65:
        socket.emit("camServo", "left")
        break
      case 68:
        socket.emit("camServo", "right")
        break
      default:
        break;
    }

  }

  moveArdu = (val) => {
    if (val === 38 || val === 40) {
      this.medirDistancia = setInterval(() => {
        if (this.recording) this.distancia++
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
    socket.emit("camServo", "stop")
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

  handleMove = (e) => {
    console.log(e.direction.toLowerCase())
    switch (e.direction.toLowerCase()) {
      case "forward":
        if (this.currentMov !== "forward") {
          socket.emit("keypress", 38)
          this.currentMov = "forward"
        }
        break
      case "backward":
        if (this.currentMov !== "backward") {
          socket.emit("keypress", 40)
          this.currentMov = "backward"
        }
        break
      case "left":
        if (this.currentMov !== "left") {
          socket.emit("keypress", 37)
          this.currentMov = "left"
        }
        break
      case "right":
        if (this.currentMov !== "right") {
          socket.emit("keypress", 39)
          this.currentMov = "right"
        }
        break
      default:
        break
    }
  }

  handleStop = (e) => {
    socket.emit("keypress", "stop")
    this.currentMov = "stop"
  }

  handleMoveCam = (e) => {

    switch (e.direction.toLowerCase()) {
      case "forward":
        socket.emit("camServo", "up")
        break
      case "backward":
        socket.emit("camServo", "down")
        break
      case "left":
        socket.emit("camServo", "left")
        break
      case "right":
        socket.emit("camServo", "right")
        break
      default:
        break
    }

  }

  handleStopCam = (e) => {
    socket.emit("camServo", "stop")

  }

  render() {
    return (
      <div>
        <div className="header">
          <div className="titleContainer">
            <h1 className="noduino-title">NODUINO</h1>
          </div>
          <div className="status">
            {/* <p className="status">UGV status: <span id="norduino-status">{this.state.boardReady ? "connected" : "disconnected"}</span></p> */}
          </div>
        </div>

        <div className="controlContent">
          <div className="controlUpper">
            <div className="liveCamContainer">
              <img src="http://192.168.1.53:8080/stream.mjpg" alt=""></img>
            </div>
            <div className="rightInfo">
              <div className={this.state.recording ? "path-info visible" : "path-info"} >
                <ul>
                  <li>Distance: {this.state.distancia}m</li>
                  <li>Landmines detected: {this.state.mines}</li>
                  <li>Time elapsed {this.state.time}s</li>
                </ul>
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
              <div className="center-button-container">
                <button
                  onClick={() => this.moveCam("center")}
                  className="snapshot-button">
                  <i className="fas fa-camera"></i> CENTER CAMERA
                </button>
              </div>
            </div>
          </div>
          <div className="controlLower">
            <div className="direction">
              <h3 className="section-title">DIRECTION</h3>
              <Joystick size={145} baseColor="#D8D8D8" stickColor="#F47A23" move={this.handleMove} stop={this.handleStop}></Joystick>

            </div>
            <div className="warning">
              <div className={this.state.metal ? "metalDetectedBox detected" : "metalDetectedBox "} >
                <div className="warningContainer">
                  <img src={warningIcon} alt="" />
                </div>
                <div className="warning-text">
                  <h4>WARNING!!</h4>
                  <p>Metal detected</p>
                </div>
              </div>
            </div>
            <div className="camControl">
              <h3 className="section-title">LIVE CAM</h3>
              <Joystick size={145} baseColor="#D8D8D8" stickColor="#F47A23" move={this.handleMoveCam} stop={this.handleStopCam}></Joystick>

            </div>
          </div>
        </div>
        <div className="footerContainer">
          <PageFooter />
        </div>
      </div>
    )
  }
}
