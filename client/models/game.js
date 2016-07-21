import fetch from 'isomorphic-fetch';

// Is there a way to make GET requests AND send on db query search
// parameters without having to make it a POST request and include
// those parameters as properties in the body?
  // Yes, you put the info on the url to send it through and then
  // use "req.params" or "req.query" to grab the information with express

//------update player's status to move-------//
export function playerMove(move, user_id){
	return fetch('/api/userMove',{
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			move: move,
      user_id: user_id
		})
	})
  .then(data => data.json())
  .catch(error => console.error(error));
}

//-----------increment player score-----------//
export function incPlayerScore(user_id){
	return fetch('/api/incUserScore',{
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
      user_id: user_id
		})
	})
  .then(data => data.json())
  .catch(error => console.error(error));
}

//--------------get player by id-------------//
export function getPlayerById(user_id){
  return fetch('/api/users/' + user_id, {
    method: 'GET',
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(data => data.json())
  .catch(error => console.error(error));
}

//--------get opponent by player id-----------//
export function getOpponentByPlayerId(user_id, gameId){
  return fetch('/api/users/' + user_id + '/opponent/' + gameId, {
    method: "GET",
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(data => data.json())
  .catch(error => console.error(error));
}
