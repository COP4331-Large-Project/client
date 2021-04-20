import React from 'react';
import { Menu } from 'antd';
import PropTypes from 'prop-types';

function UserMenu({ onLogout }) {
  return (
    <Menu>
      <Menu.Item key="0">
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
