import { SyntheticEvent, useState } from 'react';
import { notification } from 'antd';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard';
import TextInput from '../TextInput';
import Button from '../Button';
import '../../scss/landing.scss';
import API from '../../api/API';
import { CardProps } from './types';

/// callBack should be passed from landing page. Used to re-render the landing page
/// with the default landing page card, which should be the login card.

function ForgotPassword({ switchCard }: CardProps): JSX.Element {
  const [err, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');

  function isTrimmedEmpty(str: string) {
    if (str.trim() === '') {
      return true;
    }
    return false;
  }

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();
    try {
      await API.passwordRecovery(input);
      notification.success({
        description: 'Please check your email for the password reset link.',
        message: 'Please check your email for the password reset link.'
      });
      setInput('');
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <LandingCard title='Password reset' error={err ?? ''}>
      <form onSubmit={onSubmit}>
        <TextInput
          placeHolder="johndoe@email.com"
          // eslint-disable-next-line no-unused-vars
          onChange={(c) => { setInput(c); }}
        />
        <Button disabled={isTrimmedEmpty(input)} type='submit'>
          Send Reset Email
        </Button>
        <Button className="btn-link" onClick={() => switchCard('login')}>Back To Login</Button>
      </form>
    </LandingCard>
  );
}

ForgotPassword.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default ForgotPassword;
