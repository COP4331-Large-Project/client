import '../../scss/sidebar.scss';
import React, { useState } from 'react';
import { Layout } from 'antd';
import Card from '../Card.jsx';
import InviteArea from './InviteArea.jsx';
import GroupList from './GroupList.jsx';
import JoinGroupButton from './JoinGroupButton.jsx';
import Button from '../Button.jsx';
import CreateGroupModal from '../CreateGroupModal.jsx';

const { Sider } = Layout;

const groups = [
  {
    title: 'Group TBA',
    imageURL: null,
    members: 103,
  },
  {
    title: 'Socks n Sandals',
    imageURL:
      'https://images.unsplash.com/photo-1617450599731-0ec86e189589?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    members: 592,
  },
  {
    title: 'Architecture',
    imageURL:
      'https://images.unsplash.com/photo-1617538781052-b49b1bc7cbe1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1866&q=80',
    members: 900,
  },
  {
    title: 'JavaScript Junkies',
    imageURL:
      'https://images.unsplash.com/photo-1617541224621-c6dbd1bb5bbb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    members: 1,
  },
  {
    title: 'This is a group with a title that should show ellipses',
    imageURL: 'bad-url',
    members: 420,
  },
];

function Sidebar() {
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);

  const openGroupModal = () => setGroupModalVisible(true);
  const closeGroupModal = () => setGroupModalVisible(false);

  return (
    <Sider theme="light" className="sidebar">
      <Card className="sidebar-card">
        <InviteArea inviteCode="xJwY394p" />
        <GroupList groups={groups} />
        <JoinGroupButton />
        <Button onClick={openGroupModal}>Create Group</Button>
        <CreateGroupModal
          visible={isGroupModalVisible}
          onClose={closeGroupModal}
        />
      </Card>
    </Sider>
  );
}

export default Sidebar;
