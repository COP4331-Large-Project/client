import '../../scss/navbar.scss';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Layout,
  Dropdown,

} from 'antd';
import UserMenu from './UserMenu.jsx';
import UserContext from '../../contexts/UserContext.jsx';

const { Header } = Layout;

function Navbar({ logout }) {
  const user = useContext(UserContext);
  const [initials, setInitials] = useState(' ');
  const [imgURL, setImgURL] = useState(' ');

  useEffect(() => {
    if (user.firstName !== undefined) {
      setImgURL(user.imgURL);
      setInitials(`${user.firstName[0]}${user.lastName[0]}`);
    }
  }, [user]);

  return (
    <div>
      {
        // What is this "invisible backing" and what purpose does it serve?
        // The navigation bar element is an exception when it comes to flexbox items
        // because it's position is fixed and it's z-index is not 0. This causes weird
        // side effects when the navbar is placed in a parent flexbox. We could use a margin
        // to fix this but then we would have issues of overflow going under the nav bar.
        // To adapt this we just add an invisible backing backing div that matches the original size
        // and position of the nav bar, emulating the space in a flex box. This allows overflow
        // to work as expected, and allows flexbox to behave as expected.
      }
      <div className="invisible-backing" />
      <Header className="navbar">
        <h1 className="title">ImageUs</h1>
        <Dropdown overlay={<UserMenu logout={logout}/>} trigger={['click']}>
        <Avatar
          size={40}
          src={imgURL}
          alt={initials}
          className="avatar-button"
        >
          {initials}
        </Avatar>
    </Dropdown>
      </Header>
    </div>
  );
}

Navbar.propTypes = {
  logout: PropTypes.func,
};

Navbar.defaultProps = {
  logout: () => {},
};

export default Navbar;
