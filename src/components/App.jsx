import React from 'react';
import '../scss/App.scss';
import '../scss/button.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Button from './Button.jsx';

// function goToGithub() {
//   window.location.href = 'https://github.com/COP4331-Large-Project';
// }

function createUser() {
  const payload = {
    FirstName: 'Billy',
    LastName: 'Bob',
    Username: 'Bobby',
    Password: '12345',
  };

  fetch('https://api.imageus.io/users', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(response => console.log(response));
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <header className="App-header">
              <div className="Rotated-Container Gradient Box">
                <div className="Card">
                  <h1>COP4331C Large Group #7</h1>
                </div>
                <Button variant="dark" onClick={createUser}>
                  <i className="bi bi-github"> </i>
                  Visit Our Github
                </Button>
              </div>
            </header>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
