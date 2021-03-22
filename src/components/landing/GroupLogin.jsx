import React from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';

/// callBack should be passed from landing page. Used to re-render the landing page
/// with the default landing page card, which should be the login card.

function GroupLogin({ switchCard }) {
  let input;

  function login(event) {
    event.preventDefault();
    // TODO: Make login request
  }

  return (
    <LandingCard title="No account? No problem.">
      <form>
        <div className="card-form">
          <TextInput
            placeHolder="Group Code"
            // eslint-disable-next-line no-unused-vars
            onChange={(c) => { input = c; }}
          />
          <Button onClick={login}>
            Enter Code
          </Button>
          <Button onClick={() => switchCard('login')}>Back To Login</Button>
        </div>
      </form>
    </LandingCard>
  );
}

GroupLogin.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default GroupLogin;
