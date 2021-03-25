import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@primer/components';
import LandingPage from './pages/LandingPage.jsx';
import MainPage from './pages/MainPage.jsx';
import reportWebVitals from './reportWebVitals';

import './scss/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <ThemeProvider>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/main">
            <MainPage />
          </Route>
        </ThemeProvider>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
