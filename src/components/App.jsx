import React, { useState } from 'react';
import '../scss/App.scss';
import '../scss/button.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './landing/LandingPage.jsx';
import LoginCard from './landing/LoginCard.jsx';
import GroupLogin from './landing/GroupLogin.jsx';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [card, setCard] = useState('login');

  const cards = {
    login: <LoginCard switchCard={setCard} />,
    groupLogin: <GroupLogin switchCard={setCard} />,
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage card={cards[card]} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
