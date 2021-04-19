import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { message } from 'antd';
import LandingPage from './pages/LandingPage.jsx';
import MainPage from './pages/MainPage.jsx';
import GroupInvitePage from './pages/GroupInvitePage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import './scss/ant-overrides.scss';
import './scss/index.scss';

message.config({ maxCount: 1 });

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/main">
          <MainPage />
        </Route>
        <Route exact path="/verify">
          <VerifyEmailPage />
        </Route>
        <Route
          exact
          path="/invite/:inviteCode"
          render={props => (
            <GroupInvitePage inviteCode={props.match.params.inviteCode} />
          )}
        />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
