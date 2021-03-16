import React, { useState } from 'react';
import '../scss/App.scss';
import '../scss/button.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './landing/LandingPage.jsx';
import TextInput from './TextInput.jsx';
import Button from './Button.jsx';
import LandingCard from './landing/LandingCard.jsx';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [card, setCard] = useState(
    <LandingCard title="Title">
      <div className="card-form">
        <TextInput/>
        <TextInput/>
        <Button>Click Me</Button>
    </div>
    </LandingCard>,
  );

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage card={card} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
