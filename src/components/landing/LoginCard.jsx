/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Divider, message, Modal } from 'antd';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';
import API from '../../api/API';

function LoginCard({ switchCard }) {
  const history = useHistory();
  const [err, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setLoading(true);
    const data = new FormData(event.target);

    try {
      await API.login(data.get('Username'), data.get('Password'))
        .then((res) => {
          const { token, id } = res;
          localStorage.setItem('token', token);
          localStorage.setItem('id', id);
        });

      // TODO: Check if email is verified before logging in
    } catch (e) {
      // setError(e.message);
      // TODO: Handle email verification error here, this is for testing the modal
      setModalVisible(true);
      setLoading(false);
      return;
    }

    // Move to next page
    history.push('/main');
  }

  async function resendEmail() {
    setLoading(true);

    try {
      // TODO: Make request
      await API.requestEmailVerificationLink('test@example.com');
      message.success('An email was sent to your inbox');
      setModalVisible(false);
    } catch (e) {
      setError(e);
    }

    setLoading(false);
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
      <Modal
        centered
        title="Verify Your Email"
        className="verify-email-modal"
        okText={isLoading ? 'Sending' : 'Resend'}
        cancelText="Close"
        visible={isModalVisible}
        okButtonProps={{
          loading: isLoading,
          disabled: isLoading,
        }}
        onOk={resendEmail}
        onCancel={() => setModalVisible(false)}
      >
        <p className="modal-body">
          Looks like you haven&apos;t verified your email yet. Check your inbox
          or click resend if you didn&apos;t receive an email, then try logging
          in again.
        </p>
      </Modal>
    </LandingCard>
  );
}

LoginCard.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default LoginCard;
