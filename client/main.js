// React and React packages
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

// Import components
import App from './components/App';
import Menu from './components/Menu';
import Game from './components/Game';
import BattleContainer from './components/BattleContainer';
import Sidebar from './components/Sidebar';
import Rematch from './components/Rematch';

// Render that component to the DOM!
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/battle" component={BattleContainer} />
    <Route path="/rematch" component={Rematch} />
    <Route path="/:accessCode" component={Game} />
  </Router>
), document.getElementById('app'))

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Sidebar} />
    <Route path="/battle" component={Sidebar} />
    <Route path="/rematch" component={Sidebar} />
    <Route path="/:accessCode" component={Sidebar} />
  </Router>
), document.getElementById('sidebar'))
