/* eslint-disable */
import React, { useContext, useState } from 'react';
// prettier-ignore
import {
  Menu,
  notification,
  Dropdown,
  Modal,
} from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext.jsx';
import API from '../../api/API';
import EditAccountModal from '../EditAccountModal.jsx';

function UserMenu({ children }) {
  const { email } = useContext(UserContext);
  const history = useHistory();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const closeAccountModal = () => setModalVisible(false);
  const openAccountModal = () => setModalVisible(true);

  const logout = () => {
    localStorage.clear();
    history.replace('/');
  };

  const openLogoutWarning = () => {
    setMenuVisible(true);

    Modal.confirm({
      content: 'Are you sure you want to log out',
      cancelText: 'Cancel',
      okText: 'Log out',
      maskClosable: true,
      onOk: () => {
        // Need to wait a bit for the modal to close
        setTimeout(logout, 250);
      },
    });
  };

  const sendResetEmail = async () => {
    try {
      await API.passwordRecovery(email);
      notification.warning({
        message:
          'You have been logged out. Please check your email for a link to reset your password.',
      });
      logout();
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
  };

  const onMenuClick = () => setMenuVisible(false);

  const onMenuVisibleChange = visible => {
    setMenuVisible(visible);
  };

  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item onClick={openAccountModal}>Edit Account</Menu.Item>
      <Menu.Item onClick={sendResetEmail}>Reset Password</Menu.Item>
      <Menu.Item onClick={openLogoutWarning}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown
        overlay={menu}
        visible={isMenuVisible}
        trigger={['click']}
        onVisibleChange={onMenuVisibleChange}
      >
        {children}
      </Dropdown>
      <EditAccountModal visible={isModalVisible} onClose={closeAccountModal} />
    </>
  );
}

UserMenu.propTypes = {
  children: PropTypes.node,
};

UserMenu.defaultProps = {
  children: null,
};

export default UserMenu;
