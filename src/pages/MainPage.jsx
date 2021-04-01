import 'antd/dist/antd.css';
import '../scss/main-page.scss';
import { Layout } from 'antd';
import React from 'react';

const { Sider, Content, Header } = Layout;

function MainPage() {
  return (
    <Layout className="main-page">
      <Header></Header>
      <Layout>
        <Sider theme="light"></Sider>
        <Content></Content>
      </Layout>
    </Layout>
  );
}

export default MainPage;
