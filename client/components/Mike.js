import React from 'react'
import * as Game from '../models/game'

export default class Mike extends React.Component {
  constructor(){
    super();
  }

  render() {
    return (
      <div className="opponent six columns">
        <div>
          <h5>{this.props.opponent.name}</h5>
        </div>
        <div className="arena container">
          {this.props.icon ?
          <img src = {(this.props.icon).split(".png")[0] + "-opponent.png"}/> :
          <img src = "/images/qmark.png"/>}
        </div>
        <div>
          <button disabled>Cowboy</button>
          <button disabled>Princess</button>
          <button disabled>Bear</button>
        </div>
      </div>
    );
  }
}
