import React from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';

/// callBack should be passed from landing page. Used to re-render the landing page
/// with the default landing page card, which should be the login card.

function GroupLogin({ callBack }) {
  let input;

  function submitCode() {
    // TODO: Make login request
  }

  return (
    <LandingCard title="No account? No problem">
      <form onSubmit={submitCode}>
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
            onClick={callBack}
            onKeyDown={callBack}>
            Go back to login
          </div>
        </div>
      </form>
    </LandingCard>
  );
}

GroupLogin.propTypes = {
  callBack: PropTypes.func,
};

GroupLogin.defaultProps = {
  callBack: () => {},
};

export default GroupLogin;
