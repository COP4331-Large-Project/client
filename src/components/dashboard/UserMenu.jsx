import React from 'react';
import { Menu } from 'antd';
import PropTypes from 'prop-types';

function UserMenu({ logout }) {
  return (
    <Menu>
      <Menu.Item key="0">
        <div onClick={logout}>
          Logout
        </div>
      </Menu.Item>
    </Menu>
  );
}

UserMenu.propTypes = {
  logout: PropTypes.func,
};

UserMenu.defaultProps = {
  logout: () => {},
};

export default UserMenu;
