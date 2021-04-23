/* eslint-disable */
import React, { useContext, useState } from 'react';
// prettier-ignore
import {
  Menu,
  notification,
  Dropdown,
  Popconfirm,
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

  const onMenuClick = event => {
    if (event.key === 'logout') {
      setMenuVisible(true);
    } else {
      setMenuVisible(false);
    }
  };

  const onMenuVisibleChange = visible => {
    setMenuVisible(visible);
  };

  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item onClick={openAccountModal}>Edit Account</Menu.Item>
      <Menu.Item onClick={sendResetEmail}>Reset Password</Menu.Item>
      <Menu.Item key="logout" className="logout-menu-option">
        <Popconfirm
          className="logout-confirm-popup"
          title="Are you sure you want to log out?"
          okText="Log out"
          cancelText="Cancel"
          placement="left"
          onConfirm={logout}
        >
          Logout
        </Popconfirm>
      </Menu.Item>
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
