import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import * as db from '../models/menu'


export default class Challenge extends React.Component {
  constructor(props){
    super(props);
    this.state = { onlineUsers: []} 
  }

  componentDidMount() {
    setInterval(this.getOnlineUsers.bind(this), 1000);
  }

  getOnlineUsers() {
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

  setOnlineUsers(users) {
    this.setState({onlineUsers: users});
  }


  render() {
    return (
      <div>
<<<<<<< 1c71babc26e9c0ecf2ba0b96f9e7789ecec1ee7c
      <h5>Online Users</h5>
        {
          this.state.onlineUsers.length > 0
          ? this.state.onlineUsers
            .map(user => {
              return (
                <div key={user.user_id} className="challenge">
                  <img src= {user.photo_url} />
                  <button className="button-primary">CHALLENGE</button>
                  <h6> {user.name} </h6>
                </div>
              )
            })
          : null
        }
=======
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
                      ? <button className="button-primary">CHALLENGE</button>
                      : null
                    }
                  </div>
                )
              })
            : null
          }
        </div>
>>>>>>> rematch working
      </div>
    );
  }
}