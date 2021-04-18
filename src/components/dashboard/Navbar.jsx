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
  // const { imgURL, firstName, lastName } = useContext(UserContext);
  // const initials = `${firstName[0]}${lastName[0]}`;

  const user = useContext(UserContext);
  /* eslint no-unused-vars: */
  const [firstName, setFirstName] = useState(' ');
  const [lastName, setLastName] = useState(' ');
  const [initials, setInitials] = useState(' ');
  const [imgURL, setImgURL] = useState(' ');

  useEffect(() => {
    console.log(user);

    if (user.firstName !== undefined) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
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
          <a onClick={e => e.preventDefault()}>
            <Avatar
              size={40}
              src={imgURL}
              alt={initials}
              >
              {initials}
            </Avatar>
          </a>
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
