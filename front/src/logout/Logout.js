import React, { Component } from 'react'
import Server from '../server'

export default class Logout extends Component {
  constructor(props){
    super(props)


    this.server = new Server()
  }



  handleLogout = async event => {
    await this.server.logout()
    .then(data=>{
      console.log("Logout del componente")
      this.props.isLogged({logged: false})
    })
    .catch((err)=>{console.log(err)})    
  }





  render() {

   this.handleLogout()



    return (
      <div>
        
      </div>
    )
  }
}
