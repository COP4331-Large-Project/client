import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Divider } from 'antd';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';
import API from '../../api/API';
import VerifyEmailModal from '../VerifyEmailModal.jsx';

function LoginCard({ switchCard }) {
  const history = useHistory();
  const [err, setError] = useState(null);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const openEmailModal = () => setEmailModalVisible(true);
  const closeEmailModal = () => setEmailModalVisible(false);

  async function onSubmit(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setLoading(true);
    const data = new FormData(event.target);

    try {
      const res = await API.login(data.get('Username'), data.get('Password'));
      const { token, id } = res;

      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
    } catch (e) {
      if (e.message.toLowerCase().includes('not verified')) {
        openEmailModal();
      } else {
        setError(e.message);
      }
      setLoading(false);
      return;
    }

    // Move to next page
    history.push('/');
  }

  return (
    <LandingCard title="Log In" error={err}>
      <form onSubmit={onSubmit}>
        <div>
          <TextInput placeHolder="Username" name="Username" />
          <TextInput placeHolder="Password" name="Password" type="password" />
        </div>
        <Button type="submit" disabled={isLoading}>
          Login
        </Button>
        <Button
          className="btn-link"
          onClick={() => switchCard('forgotPassword')}
        >
          Forgot password?
        </Button>
        <Divider>OR</Divider>
        <Button className="btn-link" onClick={() => switchCard('register')}>
          Don&apos;t have an account?
        </Button>
      </form>
      <VerifyEmailModal
        visible={isEmailModalVisible}
        onClose={closeEmailModal}
      />
    </LandingCard>
  );
}

LoginCard.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default LoginCard;
