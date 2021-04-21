import React from 'react';
import { Menu, Popconfirm, notification } from 'antd';
import PropTypes from 'prop-types';

function GroupsMenu({ isOwner, groupId }) {
  function amITheOwner() {
    alert(`${isOwner} for ${groupId}`);
  }

  function leaveGroup() {
    try {
      // Make API call
      // Update groups
      notification.success({
        description: 'Successfully left the group.',
        duration: 2,
      });
    } catch (err) {
      notification.error({
        title: 'Could not delete group.',
        description: err,
      });
    }
  }

  return (
    <Menu>
      <Menu.Item key="0" disabled = {isOwner}>
        <Popconfirm
          title='Are you sure you want to leave this group?'
          okText="Yes"
          cancelText="No"
          onConfirm={leaveGroup}
        >
          Leave Group
        </Popconfirm>
      </Menu.Item>
      <Menu.Item key="1" onClick={amITheOwner} disabled = {!isOwner}>
        Delete Group
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
