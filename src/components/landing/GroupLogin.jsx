import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';

/// callBack should be passed from landing page. Used to re-render the landing page
/// with the default landing page card, which should be the login card.

function GroupLogin({ switchCard }) {
  let input;
  const [err, setError] = useState(null);

  function login(event) {
    event.preventDefault();
    // TODO: Make login request
    setError('Not Implemented');
  }

  return (
    <LandingCard title="No account? No problem." error={err}>
      <form>
        <TextInput
          placeHolder="Group Code"
          // eslint-disable-next-line no-unused-vars
          onChange={(c) => { input = c; }}
        />
        <Button onClick={login}>
          Enter Code
        </Button>
        <Button className="btn-link" onClick={() => switchCard('login')}>Back To Login</Button>
      </form>
    </LandingCard>
  );
}

GroupLogin.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default GroupLogin;
