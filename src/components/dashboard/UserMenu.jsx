import React from 'react';
import { Menu } from 'antd';
// import { useHistory } from 'react-router-dom';

function UserMenu() {
  // const history = useHistory();
  function logout() {
    // localStorage.clear();
    // history.replace('/');
    console.log('logout pressed');
  }

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

export default UserMenu;
