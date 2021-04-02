import '../scss/main-page.scss';
import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import 'antd/dist/antd.css';

function MainPage() {
  return (
    <div className="main-page-body">
      <Navbar />
      <div className="body-content">
        <Sidebar />
        <div className="main-content">
          <h1>Group Name</h1>
          <div style={{ height: '1000px', backgroundColor: 'red' }} />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
