import React from 'react';
import { Link, browserHistory } from 'react-router';

import Create from './Create';
import Join from './Join';
import * as db from '../models/menu';
import ChatApp from './ChatApp';
import Sidebar from './Sidebar';

export default class Menu extends React.Component{
  constructor(){
    super();
    this.state = {
      accessCode: '',
      username: '',
      view: null, 
    };
  }

  // on mount, check for authentication and save credentials to database
  componentDidMount() {
    let user_id;
    checkLogOn.call(this);
    function checkLogOn() {
      user_id = sessionStorage.getItem("user_id");
      if (user_id) {
        this.setState({view: 'menu'});
        db.generateNewSession(user_id) // add session to db
        .then(function(sessionId) {
          setTimeout(function(){
            let name = sessionStorage.getItem("name");
            let photo_url = sessionStorage.getItem("photo_url");
            let friends = sessionStorage.getItem("friends");
            db.createNewUser(user_id, name, photo_url, friends) // add user to db
          },1000);
        });
      } else {
        sessionStorage.clear();
        this.setState({view: 'loggedOut'});
        setTimeout(checkLogOn.bind(this), 800);
      }
    }

    socket.on('challenge', (challenger, challenged, accessCode, game_id) => {
      db.getUserById(challenger)
      .then(function(user){
        if (user_id === challenged) {
          if(confirm(`${user[0].name} has challenged you! Do you accept?`)) {
            sessionStorage.setItem('gameId', game_id);
            sessionStorage.setItem('accessCode', accessCode);
            db.userJoinsGame(game_id)
            .then(function(resp){
              db.updateGameStatus(game_id, 'full')
            })
            .then(function(resp){
              socket.emit('accept', challenger, challenged, accessCode, game_id);
            });
          }
        }
      })
    });

    socket.on('accept', (challenger, challenged, accessCode, game_id) => {
      browserHistory.push(`/${accessCode}`);
    });

  }

  // two-way binding for access code input
  handleAccessCodeChange(e) {
    this.setState({accessCode: e.currentTarget.value});
  }

  // two-way binding for username input
  handleUsernameChange(e) {
    this.setState({username: e.currentTarget.value});
  }

  handleViewChange(view, e) {
    e.preventDefault();
    this.setState({view: view});
  }

  _handleLogIn(view, e) {
    document.getElementById('log-in').click();
  }

  _handleLogOut(view, e) { // delete session from database and sessionStorage
    let user_id = sessionStorage.getItem("user_id");
    return db.deleteSessionByUserId(user_id)
    .then(function(resp) {
      document.getElementById('log-out').click();
      return;
    });
  }

  // show buttons based on view in state 
  render() {
    return (
      <div className="narrative container nine column">
        <h1>Bear - Princess - Cowboy</h1>
        <hr />
        {
          this.state.view === 'loggedOut'
          ? <div className="button-container">
              <button onClick={this._handleLogIn.bind(this, 'menu')}>Log In</button>
            </div>
          : this.state.view === 'menu'
          ? <div className="button-container">
              <button onClick={this.handleViewChange.bind(this, 'create')}>New Game</button>
              <button onClick={this.handleViewChange.bind(this, 'join')}>Join Game</button>
              <button onClick={this._handleLogOut.bind(this)}>Log Out</button>
            </div>
          : this.state.view === 'create'
          ? <Create 
              username={this.state.username}
              handleUsernameChange={this.handleUsernameChange.bind(this)}
              handleViewChange={this.handleViewChange.bind(this)}
            />
          : this.state.view === 'join'
          ? <Join 
              username={this.state.username}
              accessCode={this.state.accessCode}
              handleUsernameChange={this.handleUsernameChange.bind(this)}
              handleAccessCodeChange={this.handleAccessCodeChange.bind(this)}
              handleViewChange={this.handleViewChange.bind(this)}
            />
          : null
        }
        <div id="status">Loading...</div>
        <hr />

      </div>
    );
  }
}

