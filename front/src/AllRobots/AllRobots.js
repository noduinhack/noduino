import React, { Component } from 'react'
import EachRobot from '../robot/Robot'
import './AllRobots.css'
import Server from '../server'
import rd2d from './r2d2.png'
import jonny from './jonny.png'
import noduino from './noduino.jpeg'
import robocop from './robocop.png'
import PageFooter from "../pageFooter/PageFooter"
import { Link } from 'react-router-dom';

export default class AllRobots extends Component {
  constructor(props) {
    super(props)
    //arrancamos el estado con un valor de loggedInUser con nada (luego lo vamos a reemplazar con el valor real)
    this.state = {
      name: "",
      robots: []
    }
    this.picturesArray = [noduino, rd2d, robocop, jonny]
    this.serverAcces = new Server()
  }


  componentWillMount() {
    this.serverAcces.allRobots()
      .then(data => {
        console.log(data.data)
        this.setState({
          ...this.state,
          robots: data.data
        })
      })
      .catch(err => console.log(err))
  }


  login = (e) => {
    e.preventDefault()
    let logueo = new Server();
    logueo.login(this.state)
      .then((data) => {
        if (data.logged) {
          // Si el login es correcto llamo a la funcion del PADRE APP.JS
          this.props.isLogged(data)
        } else {
          // si el login es incorrecto PASO UN MENSAJE Y PUNTO
          this.setState({ ...this.state, mensaje: "Login incorrecto, merluzo" })
        }
      })
      .catch(err => console.log(err))
  }


  render() {

    return (
      <div >
        <div className="AllRobotsTitle">
          <h2>NODUINO</h2>
          <p>HOME | MY PROFILE | <Link to='/logout'>LOGOUT</Link></p>
        </div>
        <div id="available"> <h1>AVAILABLE UGVS</h1></div>
        <div className="RobotsContent">

          {this.state.robots.map((robot, index) => {

            return <EachRobot img={this.picturesArray[index]} key={index} name={robot.name} id={robot._id} distance={robot.distance} mines={robot.mines} online={robot.online} />
          })}

        </div>
        <PageFooter />
      </div>
    )
  }
}
