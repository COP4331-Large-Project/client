import React from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';

/// callBack should be passed from landing page. Used to re-render the landing page
/// with the default landing page card, which should be the login card.

function GroupLogin({ onLoginClick }) {
  let input;

  function submitCode(event) {
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
          <Button onClick={submitCode}>
            Enter Code
          </Button>
          <div
            role="button"
            tabIndex="0"
            onClick={onLoginClick}
            onKeyDown={onLoginClick}>
            Go back to login
          </div>
        </div>
      </form>
    </LandingCard>
  );
}

GroupLogin.propTypes = {
  onLoginClick: PropTypes.func,
};

GroupLogin.defaultProps = {
  onLoginClick: () => {},
};

export default GroupLogin;
