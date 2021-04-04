import '../scss/sidebar.scss';
import React from 'react';
import { Layout } from 'antd';
import Card from './Card.jsx';

const { Sider } = Layout;

function Sidebar() {
  return (
    <Sider theme="light" className="sidebar">
      <Card className="sidebar-card" />
    </Sider>
  );
}

export default Sidebar;
