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
    setInterval(this.getOnlineUsers.bind(this), 1000);
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
    this.setState({onlineUsers: users});
  }

  challengeUser (userId) {
    // e.preventDefault()
    var code = generateAccessCode();
    var gameId;
    var challenged =  userId.target.getAttribute("data");
    var challenger = sessionStorage.getItem('user_id');

    // Promise.all([
    //     db.getUserById(challenged),
    //     db.getUserById(challenger)
    //   ])
    

    challenged = db.getUserById(challenged)
      .then(challengedUser => {
        challenged = challengedUser[0];
        return challenged;
      })
      .then(challenged => {
        return db.getUserById(challenger)
      })
      .then(challengerUser => {
        challenger = challengerUser[0];
        return challenger;
      })
      .then(function(){
        //variables are working!
        console.log('challenger: ', challenger)
        console.log('challenged: ', challenged)
      })
     
     
    db.generateNewGame(code)
      .then(id => {
        gameId = id[0]
        sessionStorage.setItem('gameId', gameId);
        return gameId
      })
      .then(gameId => {
        db.userStartsGame(gameId)
          .then(resp => {
            console.log('resp in userStartsGame ', resp)
            db.userJoinsGame(gameId) 
          })

      })



    
  }






  render() {
    return (
      <div>
        <h5>Online ({this.state.onlineUsers.length}):</h5>
        <div className="challenge-container">
          {
            this.state.onlineUsers.length > 0
            ? this.state.onlineUsers
              .sort()
              .map(user => {
                return (
                  <div key={user.user_id} className="challenge">
                    <img src= {user.photo_url} />
                    <span> {user.name} </span>
                    {
                      (user.user_id !== sessionStorage.getItem("user_id")) 
                      ? <button data={user.user_id} className="button-primary" onClick={ this.challengeUser.bind(user.userId) } >CHALLENGE</button>
                      : null
                    }
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
