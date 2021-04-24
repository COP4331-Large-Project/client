import React, { useState, useContext, useEffect } from 'react';
// prettier-ignore
import {
  Dropdown,
  Menu,
  Button,
  notification,
  Modal,
} from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import PropTypes from 'prop-types';
import MemberInviteModal from '../MemberInviteModal.jsx';
import GroupsStateContext from '../../contexts/GroupStateContext.jsx';
import UserStateContext from '../../contexts/UserStateContext.jsx';
import GroupContextDispatch from '../../contexts/GroupsContextDispatch.jsx';
import API from '../../api/API';

function GroupMenu({ className, isOwner }) {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState({});
  const { groups, index } = useContext(GroupsStateContext);
  const user = useContext(UserStateContext);
  const dispatch = useContext(GroupContextDispatch);

  const openInviteModal = () => setInviteModalOpen(true);
  const closeInviteModal = () => setInviteModalOpen(false);

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  useEffect(() => {
    setGroupName(index === -1 ? '' : groups[index].name);
  }, [groups, index]);

  const removeCurrentGroup = () => {
    const newGroups = [];

    groups.forEach(group => {
      if (group.id !== groups[index].id) {
        newGroups.push(group);
      }
    });

    // Setting new index to 0 for safety if groups list is not empty
    dispatch({
      type: 'replaceGroups',
      payload: {
        groups: newGroups,
        index: newGroups.length === 0 ? -1 : 0,
      },
    });
  };

  const deleteGroup = async () => {
    try {
      await API.deleteGroup(groups[index].id, loggedInUser.id);
      removeCurrentGroup();

      notification.error({
        description: `You deleted ${groupName}.`,
        duration: 2,
      });
    } catch (err) {
      notification.error({
        description:
          'An error occurred while deleting this group, please try again',
      });
    }
  };

  const leaveGroup = async () => {
    try {
      await API.removeUser(groups[index].id, loggedInUser.id);
      // Updating groups
      removeCurrentGroup();
      notification.success({
        description: `You left ${groupName}.`,
        duration: 2,
      });
    } catch (err) {
      notification.error({
        message: 'An error occurred while leaving this group, please try again',
      });
    }
  };

  const openDeleteGroupWarning = () => {
    Modal.confirm({
      title: 'Delete Group',
      content: `
        Are you sure you want to delete ${groupName}?
        There's no going back!
      `,
      cancelText: 'Cancel',
      okText: 'Delete Group',
      maskClosable: true,
      onOk: deleteGroup,
    });
  };

  const openLeaveGroupWarning = () => {
    Modal.confirm({
      title: 'Leave Group',
      content: `Are you sure you want to leave ${groupName}?`,
      cancelText: 'Cancel',
      okText: 'Leave Group',
      maskClosable: true,
      onOk: leaveGroup,
    });
  };

  // The menu needs to be passed to ant as a variable and not
  // a render function. Doing overlay={<Element />} causes the menu to
  // stay open when an option is clicked.
  const menu = (
    <Menu>
      <Menu.Item onClick={openInviteModal}>Invite members</Menu.Item>
      <Menu.Item onClick={openLeaveGroupWarning} disabled={isOwner}>
        Leave Group
      </Menu.Item>
      <Menu.Item onClick={openDeleteGroupWarning} disabled={!isOwner}>
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
};

GroupMenu.defaultProps = {
  className: '',
  isOwner: false,
};

export default GroupMenu;
