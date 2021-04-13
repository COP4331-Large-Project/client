import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Divider } from 'antd';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';
import API from '../../api/API';

function LoginCard({ switchCard }) {
  const history = useHistory();
  const [err, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    try {
      await API.login(data.get('Username'), data.get('Password'))
        .then((res) => {
          const { token, id } = res;
          localStorage.setItem('token', token);
          localStorage.setItem('id', id);
        });
    } catch (e) {
      setError(e.message);
      return;
    }

    // Move to next page
    history.push('/main');
  }

  return (
    <LandingCard title="Log In" error={err}>
      <form onSubmit={onSubmit}>
        <div>
          <TextInput placeHolder="Username" name="Username" />
          <TextInput placeHolder="Password" name="Password" type="password" />
        </div>
        <Button type="submit">Login</Button>
        <Button className="btn-link" onClick={() => switchCard('forgotPassword')}>Forgot password?</Button>
        <Divider>OR</Divider>
        <Button className="btn-link" onClick={() => switchCard('register')}>Don&apos;t have an Account?</Button>
      </form>
    </LandingCard>
  );
}

LoginCard.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default LoginCard;
