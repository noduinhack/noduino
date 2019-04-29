import React, { Component } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import Profile from './profile/Profile'
import Login from './login/Login'
//import Control from './control/Control'
import ControlIpad from './controlIpad/ControlIpad'
import authServer from './server';
import AllRobots from './AllRobots/AllRobots'
import Logout from './logout/Logout'

class App extends Component {
  constructor(props) {
    super(props)
    //arrancamos el estado con un valor de loggedInUser con nada (luego lo vamos a reemplazar con el valor real)
    this.state = {
      isLogged: false,
      user: ""
    }
    this.authServer = new authServer();
  }

  componentDidMount() {
    console.log("IsLoggedIn en APP")
    this.authServer.isLoggedIn()
      .then(({ user, logged }) => this.setState({ ...this.state, user, isLogged: logged }))
      .catch(err => console.log(err));
  }



  isLogged = (datos) => {
    //Los datos le llegan del componente LOGIN
    if (datos.logged) {
      this.setState({
        ...this.state,
        isLogged: true
      })
    } else {
      this.setState({
        ...this.state,
        isLogged: false
      })
    }
  }

  comprobar = () => {


  }

  render() {

    return (
      <div >

        <Switch>

          {/* <Route exact path={"/robots"} component={AllRobots} /> */}
          <Route exact path={"/logout"} render={() => {
            console.log(this.state.isLogged)
            return this.state.isLogged ? <Logout isLogged={this.isLogged} /> : <Redirect to="/" />
          }} />

          {/* <Route exact path={"/"} component={Login} /> */}
          <Route exact path={"/profile"} render={() => {
            console.log(this.state.isLogged)
            return this.state.isLogged ? <Profile isLogged={this.isLogged} /> : <Redirect to="/" />
          }} />

          <Route exact path={"/robots"} render={() => {
            console.log(this.state.isLogged)
            return this.state.isLogged ? <AllRobots isLogged={this.isLogged} /> : <Redirect to="/" />
          }} />

          <Route exact path={"/control"} render={() => {
            console.log(this.state.isLogged)
            return this.state.isLogged ? <Redirect to="/" /> : <Redirect to="/" />
          }} />

          {/* <Route exact path={"/control/:id"} component={Control} /> */}
          <Route exact path={"/control/:id"} component={ControlIpad} />

          <Route exact path={"/"} render={() => {
            return this.state.isLogged ? <Redirect to="/robots" /> : <Login isLogged={this.isLogged} />
          }} />
        </Switch>
      </div>
    )
  }
}

export default App;
