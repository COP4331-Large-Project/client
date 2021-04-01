import '../scss/main-page.scss';
import React from 'react';
import { Layout } from 'antd';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

const { Content } = Layout;

function MainPage() {
  return (
    <Layout className="main-page">
      <Navbar />
      <Sidebar />
      <Content className="main-content" />
    </Layout>
  );
}

export default MainPage;
