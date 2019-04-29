import './robot.css'
import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class Robots extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div className={this.props.online ? "eachRobot" : "eachRobot offline"}>
        <div className="robotTitle">
          <h2>{this.props.name}</h2>
          <p>Location: Madrid, Spain</p>
        </div>
        <div className="robotContent">
          <div className="robotImg"><img src={this.props.img} alt="" /></div>
          <div className="robotInfo">
            <h3>Status: {this.props.online ? "online" : "offline"}</h3>
            <p>{this.props.distance} travelled</p>
            <p>{this.props.mines} landmines detected</p>
            {
              this.props.online
                ? <Link to={`/control/${this.props.id}`} key={this.props.id} ><button >Select UGV</button></Link>
                : <Link to={`/control/${this.props.id}`} key={this.props.id} onClick={e => e.preventDefault()}><button>Select UGV</button></Link>
            }
          </div>

        </div>
      </div>
    )
  }
}
