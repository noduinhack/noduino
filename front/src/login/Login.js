import React, { Component } from 'react'

import PageFooter from "../pageFooter/PageFooter"
import Server from '../server'
import './login.css'

export default class Login extends Component {
  constructor(props) {
    super(props)
    //arrancamos el estado con un valor de loggedInUser con nada (luego lo vamos a reemplazar con el valor real)
    this.state = {
      username: "",
      password: "",
      logged: false,
      mines: 0,
      distance: 0,
      time: 0,
    }
    this.serverAcces = new Server()
  }


  componentWillMount() {

    this.serverAcces.updateCounters()
      .then(data => {
        const { mines, distance, time } = data.data
        console.log(data)
        console.log("Desde el componente")
        this.setState({
          ...this.state,
          mines: mines,
          distance: distance,
          time: time
        })
      })
  }

  handler = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })

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
    console.log(this.state)

    return (
      <div id="login-container">
        <div className="login-form">
          <h1>Noduino</h1>
          <div id="info">
            <div><p>{this.state.mines}</p>
              <strong> Landmines detected</strong>
            </div>
            <div>
              <p>{this.state.distance} </p>
              <strong>Metres explored</strong>
            </div>
            <div>
              <p>{this.state.time}</p>
              <strong>Seconds working</strong>
            </div>
          </div>
          <form onSubmit={this.login}>
            <div id="login">
              <div className="input-field">
                <label>Username
            </label>
                <input type="text" name="username" onChange={this.handler} value={this.state.username}></input>
              </div>
              <div className="input-field">
                <label>Password
            </label>
                <input type="password" name="password" onChange={this.handler} value={this.state.password} ></input>
              </div>

              <div className="login-buttons">
                <button className="buttonHelp" name="help">I need help</button>
                <button className="buttonLogin" name="login">Log In</button>
              </div>

              <a className="link" href="/#">I want to know more about the project</a>
            </div>
          </form>

          <h2> {this.state.mensaje}</h2>

        </div>
        <PageFooter />
      </div>
    )
  }
}
