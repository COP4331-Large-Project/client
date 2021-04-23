import React, { useState, useContext, useEffect } from 'react';
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
import GroupsStateContext from '../../contexts/GroupStateContext.jsx';
import UserContext from '../../contexts/UserContext.jsx';
import GroupContextDispatch from '../../contexts/GroupsContextDispatch.jsx';
import API from '../../api/API';

function GroupMenu({ className, isOwner }) {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const openInviteModal = () => setInviteModalOpen(true);
  const closeInviteModal = () => setInviteModalOpen(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const { groups, index } = useContext(GroupsStateContext);
  const user = useContext(UserContext);
  const dispatch = useContext(GroupContextDispatch);

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  function amITheOwner() {
    notification.success({
      description: `${loggedInUser.firstName} is owner of ${groups[index].name}? ${isOwner}`,
    });
  }

  function removeCurGroup() {
    const newGroups = [];

    groups.forEach(group => {
      if (group.id !== groups[index].id) {
        newGroups.push(group);
      }
    });

    dispatch({
      type: 'replaceGroups',
      payload: {
        groups: newGroups,
        index: newGroups.length === 0 ? -1 : index,
      },
    });
  }

  async function leaveGroup() {
    const groupName = groups[index].name;
    try {
      await API.removeUsers(groups[index].id, [loggedInUser.id]);
      // Updating groups
      removeCurGroup();
      notification.success({
        description: `Successfully left ${groupName}.`,
        duration: 2,
      });
    } catch (err) {
      notification.error({
        title: `Could not delete ${groupName}`,
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
          title={`Are you sure you want to leave ${groups[index].name}?`}
          okText="Yes"
          cancelText="No"
          onConfirm={leaveGroup}
          disabled={isOwner}
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
};

GroupMenu.defaultProps = {
  className: '',
  isOwner: false,
  groupId: '',
};

export default GroupMenu;
