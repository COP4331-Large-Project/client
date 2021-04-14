import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { message } from 'antd';
import LandingPage from './pages/LandingPage.jsx';
import MainPage from './pages/MainPage.jsx';
import GroupInvitePage from './pages/GroupInvitePage.jsx';
import reportWebVitals from './reportWebVitals';

import 'antd/dist/antd.css';
import './scss/ant-overrides.scss';
import './scss/index.scss';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';

message.config({ maxCount: 1 });

ReactDOM.render(
  <React.StrictMode>
    {/* <AnimatePresence exitBeforeEnter initial={false} />
    <Router>
      <Switch>
        <Route exact path="/">
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                opacity: 0,
              }}
              transition={{ duration: 2, type: 'spring' }}
            >
              <LandingPage />
          </motion.div>
        </Route>
        <Route exact path="/main">
          <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.5,
                opacity: 0,
                transition: { duration: 1.5 },
              }}
              transition={{ duration: 2, type: 'spring' }}
            >
              <MainPage />
          </motion.div>
        </Route>
      </Switch>
    </Router>
    <AnimatePresence /> */}
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
