import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Divider } from 'antd';
import LandingCard from './LandingCard';
import TextInput from '../TextInput';
import Button from '../Button';
import '../../scss/landing.scss';
import API from '../../api/API';
import VerifyEmailModal from '../VerifyEmailModal';
import { CardProps } from './types';

function LoginCard({ switchCard }: CardProps): JSX.Element {
  const history = useHistory();
  const [err, setError] = useState<string | null>(null);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const openEmailModal = () => setEmailModalVisible(true);
  const closeEmailModal = () => setEmailModalVisible(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const data = new FormData(event.target as HTMLFormElement);
    const username = data.get('Username') as string;
    const password = data.get('Password') as string;

    if (!username.trim() || !password.trim()) {
      return;
    }

    setLoading(true);

    try {
      const res = await API.login(username, password);
      const { token, id } = res;

      localStorage.setItem('token', token ?? '');
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
    <LandingCard title="Log In" error={err ?? undefined}>
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
