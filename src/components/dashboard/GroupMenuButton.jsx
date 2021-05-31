import React, { useState, useEffect } from 'react';
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
import { useUserState } from '../../hooks/user';
import { useGroups, useGroupsState } from '../../hooks/group';
import API from '../../api/API';
import ImageUploadModal from '../ImageUploadModal.jsx';
import GroupActions from '../../actions/GroupActions';

function GroupMenu({ className, isOwner }) {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState({});
  const { groups, index } = useGroupsState();
  const user = useUserState();
  const { dispatch } = useGroups();

  const openInviteModal = () => setInviteModalOpen(true);
  const closeInviteModal = () => setInviteModalOpen(false);

  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => setUploadModalOpen(false);

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
    dispatch(GroupActions.replaceGroups(newGroups, newGroups.length === 0 ? -1 : 0));
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
      content: (
        <span>
          Are you sure you want to delete <b>{groupName}</b>? There&apos;s no
          going back!
        </span>
      ),
      cancelText: 'Cancel',
      okText: 'Delete Group',
      maskClosable: true,
      onOk: deleteGroup,
      okType: 'danger',
      autoFocusButton: 'cancel',
    });
  };

  const openLeaveGroupWarning = () => {
    Modal.confirm({
      title: 'Leave Group',
      content: (
        <span>
          Are you sure you want to leave <b>{groupName}</b>?
        </span>
      ),
      cancelText: 'Cancel',
      okText: 'Leave Group',
      maskClosable: true,
      onOk: leaveGroup,
      okType: 'danger',
      autoFocusButton: 'cancel',
    });
  };

  // The menu needs to be passed to ant as a variable and not
  // a render function. Doing overlay={<Element />} causes the menu to
  // stay open when an option is clicked.
  const menu = (
    <Menu>
      <Menu.Item onClick={openInviteModal}>Invite Members</Menu.Item>
      <Menu.Item onClick={openUploadModal}>Upload Image</Menu.Item>
      <Menu.Item
        onClick={openLeaveGroupWarning}
        disabled={isOwner}
        danger={!isOwner}
      >
        Leave Group
      </Menu.Item>
      <Menu.Item
        onClick={openDeleteGroupWarning}
        disabled={!isOwner}
        danger={isOwner}
      >
        Delete Group
      </Menu.Item>
      <MemberInviteModal
        visible={isInviteModalOpen}
        onClose={closeInviteModal}
      />
      <ImageUploadModal
        visible={isUploadModalOpen}
        onClose={closeUploadModal}
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
