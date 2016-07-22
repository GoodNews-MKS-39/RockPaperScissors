import React from 'react'
import { Link, browserHistory } from 'react-router'
import * as db from '../models/menu';
//--------------------Game Over Page-------------//
export default class End extends React.Component{
  componentDidMount() {
    let user_id = sessionStorage.getItem("user_id");
    let game_id = sessionStorage.getItem("gameId");
    db.resetUser(user_id);
    db.updateGameStatus(game_id, 'full');
    db.gameEnd(game_id);

    socket.on('rematch', (gameId) => {
      console.log('heard rematch socket');
      this.props.rematch();
    });
  }

  rematchClick() {
    this.gameId = +sessionStorage.getItem('gameId');
    socket.emit('rematch', this.gameId);
    this.props.rematch();
  }

  render() {
    return (
      <section className="narrative container six columns offset-by-three">

        <hr />
        {
          // this.props.photo_url
          // ? <img src={this.props.photo_url}></img>
          // : null
        }
        <h1>{this.props.winner} wins the game!</h1>

        <hr />

        <div className="button-container">
          <button onClick={this.rematchClick.bind(this)}>Rematch</button>
          <Link to="/"><button>Leave Game</button></Link>
        </div>

      </section>
    );
  }
}
