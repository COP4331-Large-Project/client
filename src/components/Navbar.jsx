import '../scss/navbar.scss';
import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

function Navbar() {
  return (
    <Header className="navbar">
      <h1 className="title">ImageUs</h1>
    </Header>
  );
}

export default Navbar;
