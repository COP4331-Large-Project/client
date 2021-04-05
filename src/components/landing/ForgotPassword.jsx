import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { BsQuestionCircle } from 'react-icons/bs';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';

/// callBack should be passed from landing page. Used to re-render the landing page
/// with the default landing page card, which should be the login card.

function ForgotPassword({ switchCard }) {
  let input;
  const [err, setError] = useState(null);

  function login(event) {
    event.preventDefault();
    // TODO: Make login request
    setError('Not Implemented');
  }

  return (
    <LandingCard error={err}>
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
        <Tooltip placement='bottom' title='A group code is used to log in anonymously as a guest. No groups will be saved.'>
          <h4 className='landing-hint'>
            What is a group code <BsQuestionCircle/>
          </h4>
        </Tooltip>
      </form>
    </LandingCard>
  );
}

ForgotPassword.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default ForgotPassword;
