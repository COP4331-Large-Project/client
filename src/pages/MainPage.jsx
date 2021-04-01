import 'antd/dist/antd.css';
import '../scss/main-page.scss';
import React from 'react';
import { Layout } from 'antd';
import Card from '../components/Card.jsx';

const { Sider, Content, Header } = Layout;

function MainPage() {
  return (
    <Layout className="main-page">
      <Header className="header">
        <h1 className="title">ImageUs</h1>
      </Header>
      <Layout>
        <Sider theme="light" className="sidebar">
          <Card className="sidebar-card" />
        </Sider>
        <Content className="main-content" />
      </Layout>
    </Layout>
  );
}

export default MainPage;
