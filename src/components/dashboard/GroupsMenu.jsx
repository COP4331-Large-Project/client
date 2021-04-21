import React from 'react';
import { Menu } from 'antd';
import PropTypes from 'prop-types';

function GroupsMenu({ isOwner, groupId }) {
  function amITheOwner() {
    alert(`${isOwner} for ${groupId}`);
  }

  return (
    <Menu>
      <Menu.Item key="0" onClick={amITheOwner}>
        Am I the owner?
      </Menu.Item>
    </Menu>
  );
}

GroupsMenu.propTypes = {
  isOwner: PropTypes.bool,
  groupId: PropTypes.string,
};

GroupsMenu.defaultProps = {
  isOwner: false,
  groupId: '',
};

export default GroupsMenu;
