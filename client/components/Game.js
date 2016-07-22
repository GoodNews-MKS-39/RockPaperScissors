import React from 'react';
import { Link, browserHistory } from 'react-router'

import * as Menu from '../models/menu';
import Lobby from './Lobby';
import BattleContainer from './BattleContainer';
import Rematch2 from './Rematch2';
import End from './End';

//-------------------------Sets up Pre-Battle Views--------------//
export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      view: 'lobby',
      //rematch: false,
      winner: '',
      photo_url: ''
    };
  }

  componentDidMount() {
    this.user_id = +sessionStorage.getItem('user_id');
    this.gameId = +sessionStorage.getItem('gameId');
    // Menu.getUserById(this.user_id)
    // .then(function(user){
    //   this.setState({photo_url: user[0].photo_url})
    // });
    
    // listens for 'start game' broadcasts
    // changes view for current client if this gameId matches broadcast gameId
    socket.on('start game', gameId => {
      if (gameId === this.gameId) { 
        this.startGame();
      }
    });
  }

  startGame() {
    this.setState({view: 'battle'});
  }

  endGame(winner) {
    this.setState({
      view: 'end',
      winner: winner
    });
  }

  rematch(){
    this.setState({
      winner: '',
      view: 'rematch'
    });
  };

  render() {
    return (
      <div>
        {this.state.view === 'lobby' ?
        <Lobby 
          accessCode={this.props.params.accessCode} 
          startGame={this.startGame.bind(this)}
        /> : this.state.view === 'rematch' ?
        <Rematch2 
          accessCode={this.props.params.accessCode} 
          startGame={this.startGame.bind(this)}
        /> : this.state.view === 'battle' ?
        <BattleContainer 
          endGame={this.endGame.bind(this)} 
        /> : 
        <End 
          winner={this.state.winner}
          photo_url={this.state.photo_url}
          rematch={this.rematch.bind(this)} 
        />}
      </div>
    );
  }
}
