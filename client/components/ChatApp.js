import React from 'react';
import io from 'socket.io-client';
import * as db from '../models/menu'
import user_id from './Game'


class ChatApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = { messages: [] }
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
	  this.user_id = +sessionStorage.getItem('user_id');
	  this.socket = io('/')
	  socket.on('message', (message, user_id) => {
	  	this.setState({messages: [message, ...this.state.messages] })
	  })
	}

	handleSubmit(event) {
		event.persist()
		const body = event.target.value
		if(event.keyCode === 13 && body) {
			console.log("in if?")
		var user = db.getUserById(this.user_id)
      .then(user => {
			let username = user[0].name
			const message = {
				body: body,
				from: username
			}	
			this.setState({ messages: [...this.state.messages] })
	  		this.socket.emit('message', message)
			event.target.value = ''
		})
	}
};

	render () {
		const messages = this.state.messages.map((message, index) => {
			return <div key={index}><b>{message.from} : </b>{message.body}</div>
		})

		return (
			<div>
				<div>
					<h4>Messages</h4>
				</div>
			<div className="chat-app">{messages.reverse()}</div>	
				<footer id="footer"><input type='text' placeholder='enter message...' onKeyUp={this.handleSubmit} /></footer>
			</div>
		)
	}
}

export default ChatApp