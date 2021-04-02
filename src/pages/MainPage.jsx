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
          Content Goes here...
        </div>
      </div>
    </div>
  );
}

export default MainPage;
