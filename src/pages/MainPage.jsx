import '../scss/main-page.scss';
import 'antd/dist/antd.css';

import React from 'react';
import { Button } from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import { motion } from 'framer-motion';
import Navbar from '../components/dashboard/Navbar.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import PhotoGrid from '../components/dashboard/PhotoGrid.jsx';

const photos = [
  'https://images.unsplash.com/photo-1617450599731-0ec86e189589?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1617538781052-b49b1bc7cbe1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1866&q=80',
  'https://images.unsplash.com/photo-1617541224621-c6dbd1bb5bbb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
  'https://images.unsplash.com/photo-1617547138068-230e9714712e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
  'https://images.unsplash.com/photo-1617546400924-bd3659f2f102?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
  'https://images.unsplash.com/photo-1617516202907-ff75846e6667?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1828&q=80',
  'https://images.unsplash.com/photo-1617538818560-53299d156bd6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
  'https://images.unsplash.com/photo-1617505481649-8d0accca73d6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
  'https://images.unsplash.com/photo-1617330070571-60434437a26c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
  'https://images.unsplash.com/photo-1617504546842-5768342f1c46?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80',
  'https://images.unsplash.com/photo-1617510031576-c9db88171057?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80',
  'https://images.unsplash.com/photo-1617505907947-9cb31eb80183?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
  'https://images.unsplash.com/photo-1617505481649-8d0accca73d6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
  'https://images.unsplash.com/photo-1617330070571-60434437a26c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
  'https://images.unsplash.com/photo-1617504546842-5768342f1c46?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80',
  'https://images.unsplash.com/photo-1617510031576-c9db88171057?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80',
  'https://images.unsplash.com/photo-1617505907947-9cb31eb80183?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
];

function MainPage() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        scale: 0.5,
        opacity: 0,
        transition: { duration: 1.5 },
      }}
      transition={{ duration: 2, type: 'spring' }}
    >
      <div className="main-page-body">
        <Navbar />
        <div className="body-content">
          <Sidebar />
          <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h1>Group Name</h1>
              <Button
                type="primary"
                size="large"
                shape="circle"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <BsThreeDots />
              </Button>
            </div>
            <PhotoGrid photos={photos} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MainPage;
