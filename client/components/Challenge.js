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
      </div>
    );
  }
}