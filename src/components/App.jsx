import React, { useState } from 'react';
import '../scss/App.scss';
import '../scss/button.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import LandingPage from './landing/LandingPage.jsx';
import LoginCard from './landing/LoginCard.jsx';
import GroupLogin from './landing/GroupLogin.jsx';
import '../scss/landing.scss';

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
          <SwitchTransition>
            <CSSTransition
              key={card}
              addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
              classNames='fade'
            >
              <LandingPage card={cards[card]} />
            </CSSTransition>
          </SwitchTransition>

        </Route>
      </Switch>
    </Router>
  );
}

export default App;
