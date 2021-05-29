import { useState, useContext, useEffect } from 'react';
// prettier-ignore
import {
  Dropdown,
  Menu,
  Button,
  notification,
  Modal,
} from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import MemberInviteModal from '../MemberInviteModal.jsx';
import GroupsStateContext from '../../contexts/GroupStateContext.jsx';
import UserStateContext from '../../contexts/UserStateContext.js';
import GroupContextDispatch from '../../contexts/GroupsContextDispatch.jsx';
import API from '../../api/API';
import ImageUploadModal from '../ImageUploadModal.jsx';
import { Group, User } from '../../types.js';

type GroupMenuProps = {
  className?: string;
  isOwner: boolean; 
}

function GroupMenu({ className, isOwner }: GroupMenuProps): JSX.Element {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<Partial<User>>({});
  const { groups, index } = useContext(GroupsStateContext);
  const user = useContext(UserStateContext);
  const dispatch = useContext(GroupContextDispatch);

  const openInviteModal = () => setInviteModalOpen(true);
  const closeInviteModal = () => setInviteModalOpen(false);

  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => setUploadModalOpen(false);

  useEffect(() => {
    setLoggedInUser(user!);
  }, [user]);

  useEffect(() => {
    setGroupName(index === -1 ? '' : groups[index].name);
  }, [groups, index]);

  const removeCurrentGroup = () => {
    const newGroups: Group[] = [];

    groups.forEach(group => {
      if (group.id !== groups[index].id) {
        newGroups.push(group);
      }
    });

    // Setting new index to 0 for safety if groups list is not empty
    dispatch!({
      type: 'replaceGroups',
      payload: {
        groups: newGroups,
        index: newGroups.length === 0 ? -1 : 0,
      },
    });
  };

  const deleteGroup = async () => {
    try {
      await API.deleteGroup(groups[index].id, loggedInUser.id ?? '');
      removeCurrentGroup();

      notification.error({
        description: `You deleted ${groupName}.`,
        message: `${groupName} was deleted.`,
        duration: 2,
      });
    } catch (err) {
      notification.error({
        description:
          'An error occurred while deleting this group, please try again',
        message: 'An error occurred'
      });
    }
  };

  const leaveGroup = async () => {
    try {
      await API.removeUser(groups[index].id, loggedInUser.id ?? '');
      // Updating groups
      removeCurrentGroup();
      notification.success({
        description: `You left ${groupName}.`,
        message: `You are no longer a member of ${groupName}`,
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

export default GroupMenu;
