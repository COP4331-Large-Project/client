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
  const openInviteModal = () => setInviteModalOpen(true);
  const closeInviteModal = () => setInviteModalOpen(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const { groups, index } = useContext(GroupsStateContext);
  const user = useContext(UserStateContext);
  const dispatch = useContext(GroupContextDispatch);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  useEffect(() => {
    setGroupName(index === -1 ? '' : groups[index].name);
  }, [groups, index]);

  function amITheOwner() {
    notification.success({
      description: `${loggedInUser.firstName} is owner of ${groupName}? ${isOwner}`,
    });
  }

  function removeCurGroup() {
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
  }

  async function leaveGroup() {
    try {
      await API.removeUser(groups[index].id, loggedInUser.id);
      // Updating groups
      removeCurGroup();
      notification.success({
        description: `You left ${groupName}.`,
        duration: 2,
      });
    } catch (err) {
      notification.error({
        message: `Could not delete ${groupName}`,
        description: err,
      });
    }
  }

  const openLeaveGroupWarning = () => {
    Modal.confirm({
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
      <Menu.Item onClick={amITheOwner} disabled={!isOwner}>
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
