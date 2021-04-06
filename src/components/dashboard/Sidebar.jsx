import '../../scss/sidebar.scss';
import React from 'react';
import { Layout } from 'antd';
import Card from '../Card.jsx';
import InviteArea from './InviteArea.jsx';

const { Sider } = Layout;

function Sidebar() {
  return (
    <Sider theme="light" className="sidebar">
      <Card className="sidebar-card">
        <InviteArea inviteCode="xJwY394p" />
      </Card>
    </Sider>
  );
}

export default Sidebar;
