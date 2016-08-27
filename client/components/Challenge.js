import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import Join from './Create'
import * as db from '../models/menu'


export default class Challenge extends React.Component {
  constructor(props){
    super(props);
    this.state = { onlineUsers: []} 
  }
 
  componentDidMount () {
    setInterval(this.getOnlineUsers.bind(this), 500);
  }

  getOnlineUsers () {
    var users = [];
    db.getSessions()
    .then(sessions => {
      sessions.forEach(session => {
        db.getUserById(session.user_id)
        .then(user => {
          users.push(user[0]);
        });
      });
      setTimeout(this.setOnlineUsers.bind(this, users), 500);
    })
  }

  setOnlineUsers (users) {
    this.setState({ onlineUsers: users.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      }) });
  }

  challengeUser (userId) {
    // e.preventDefault()
    var accessCode = generateAccessCode();
    var challenged =  userId.target.getAttribute("data");
    var challenger = sessionStorage.getItem('user_id');
    var game_id;
    db.generateNewGame(accessCode)
    .then(id => {
      game_id = id[0];
      // set current gameId to local storage
      sessionStorage.setItem('gameId', game_id);
      sessionStorage.setItem('accessCode', accessCode);
      db.userJoinsGame(game_id)
      .then(function(resp){
        db.updateGameStatus(game_id, 'full')
        .then(function(resp){
          socket.emit('challenge', challenger, challenged, accessCode, game_id);
        });
      });
    });  
  }

  render() {
    return (
      <div>
        <h4>Online ({this.state.onlineUsers.length}):</h4>
        <div className="challenge-container">
          {
            this.state.onlineUsers.length > 0
            ? this.state.onlineUsers
              .sort()
              .map(user => {
                return (
                  <div key={user.user_id} className="challenge">
                    <div className="challenge-img"><img className="sidebar" src= {user.photo_url} /></div>
                    <div className="challenge-button-name">
                      <span> {user.name} </span>
                      {
                        (user.user_id !== sessionStorage.getItem("user_id")) 
                        ? <button data={user.user_id} className="button-primary" onClick={ this.challengeUser.bind(user.userId) } >CHALLENGE</button>
                        : null
                      }
                    </div>
                  </div>
                )
              })
            : null
          }
        </div>
      </div>
    );
  }
}

  function generateAccessCode() {
    let code = "";
    const possible = "abcdefghijklmnopqrstuvwxyz";
    for(let i = 0; i < 4; i++){
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
  }
