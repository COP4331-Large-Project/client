import React, { useContext } from 'react';
import { Menu, notification } from 'antd';
import PropTypes from 'prop-types';
import UserContext from '../../contexts/UserContext.jsx';
import API from '../../api/API';

function UserMenu({ onLogout }) {
  const { email } = useContext(UserContext);

  async function sendResetEmail() {
    try {
      await API.passwordRecovery(email);
      notification.warning({
        message: 'You have been logged out. Please check your email for a link to reset your password.',
      });
      onLogout();
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  }

  return (
    <Menu>
      <Menu.Item key="0" onClick={sendResetEmail}>
          Reset Password
      </Menu.Item>
      <Menu.Item key="1" onClick={onLogout}>
          Logout
      </Menu.Item>
    </Menu>
  );
}

UserMenu.propTypes = {
  onLogout: PropTypes.func,
};

UserMenu.defaultProps = {
  onLogout: () => {},
};

export default UserMenu;
