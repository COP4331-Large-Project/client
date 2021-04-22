import React, { useState } from 'react';
import {
  Dropdown,
  Menu,
  Button,
  Popconfirm,
  notification,
} from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import PropTypes from 'prop-types';
import MemberInviteModal from '../MemberInviteModal.jsx';
// import GroupsStateContext from '../../contexts/GroupStateContext.jsx';
// import UserContext from '../../contexts/UserContext.jsx';

function GroupMenu({ className, isOwner, groupId }) {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const openInviteModal = () => setInviteModalOpen(true);
  const closeInviteModal = () => setInviteModalOpen(false);
  // const { groups, index } = useContext(GroupsStateContext);
  // const { user } = useContext(UserContext);

  function amITheOwner() {
    notification.success({
      description: `${isOwner} for ${groupId}`,
    });
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

  // The menu needs to be passed to ant as a variable and not
  // a render function. Doing overlay={<Element />} causes the menu to
  // stay open when an option is clicked.
  const menu = (
    <Menu>
      <Menu.Item onClick={openInviteModal}>Invite members</Menu.Item>
      <Menu.Item disabled = {isOwner}>
        <Popconfirm
          title='Are you sure you want to leave this group?'
          okText="Yes"
          cancelText="No"
          onConfirm={leaveGroup}
        >
          Leave Group
        </Popconfirm>
      </Menu.Item>
      <Menu.Item onClick={amITheOwner} disabled = {!isOwner}>
        Delete Group
      </Menu.Item>
      <MemberInviteModal
        visible={isInviteModalOpen}
        onClose={closeInviteModal}
      />
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button className={className} type="primary">
        <BsThreeDots />
      </Button>
    </Dropdown>
  );
}

GroupMenu.propTypes = {
  className: PropTypes.string,
  isOwner: PropTypes.bool,
  groupId: PropTypes.string,
};

GroupMenu.defaultProps = {
  className: '',
  isOwner: false,
  groupId: '',
};

export default GroupMenu;
