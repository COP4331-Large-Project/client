import '../../scss/sidebar.scss';
import React, { useState } from 'react';
import { Layout } from 'antd';
import Card from '../Card.jsx';
import InviteArea from './InviteArea.jsx';
import JoinGroupButton from './JoinGroupButton.jsx';
import Button from '../Button.jsx';
import CreateGroupModal from '../CreateGroupModal.jsx';

const { Sider } = Layout;

function Sidebar() {
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);

  const openGroupModal = () => setGroupModalVisible(true);
  const closeGroupModal = () => setGroupModalVisible(false);

  return (
    <Sider theme="light" className="sidebar">
      <Card className="sidebar-card">
        <InviteArea inviteCode="xJwY394p" />
        <JoinGroupButton/>
        <Button onClick={openGroupModal}>Create Group</Button>
      </Card>
      <CreateGroupModal
        visible={isGroupModalVisible}
        onClose={closeGroupModal}
      />
    </Sider>
  );
}

export default Sidebar;
