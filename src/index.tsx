import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { message } from 'antd';
import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';
import GroupInvitePage from './pages/GroupInvitePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import PasswordResetPage from './pages/PasswordResetPage';
import NotFoundPage from './pages/NotFoundPage';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import './scss/ant-overrides.scss';
import './scss/index.scss';
import { UserProvider } from './contexts/UserContextDispatch';
import { GroupsProvider } from './contexts/GroupsContextDispatch';

message.config({ maxCount: 1 });

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/landing">
          <LandingPage />
        </Route>
        <Route exact path="/">
          <UserProvider>
            <GroupsProvider>
              <MainPage />
            </GroupsProvider>
          </UserProvider>
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
        <Route
          exact
          path="/users/:userId/password-reset"
          render={props => (
            <PasswordResetPage userId={props.match.params.userId} />
          )}
        />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
