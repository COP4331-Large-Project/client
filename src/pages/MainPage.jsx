import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../scss/main-page.scss';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import Navbar from '../components/dashboard/Navbar.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import PhotoGrid from '../components/dashboard/PhotoGrid.jsx';
import API from '../api/API';
import UserContext from '../contexts/UserContext.jsx';
import GroupContext from '../contexts/GroupContext.jsx';

import Groups from '../models/groups'; // Dummy group list.

// TODO: Bring group context up and make it hold an object that contains the
//        group list and the current index
// TODO: Make group title change in main-body-content
// TODO: Change the sidebar info to reflect the group it has

// const photos = [
//   'https://images.unsplash.com/photo-1617450599731-0ec86e189589?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
//   'https://images.unsplash.com/photo-1617538781052-b49b1bc7cbe1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1866&q=80',
//   'https://images.unsplash.com/photo-1617541224621-c6dbd1bb5bbb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
//   'https://images.unsplash.com/photo-1617547138068-230e9714712e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
//   'https://images.unsplash.com/photo-1617546400924-bd3659f2f102?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
//   'https://images.unsplash.com/photo-1617516202907-ff75846e6667?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1828&q=80',
//   'https://images.unsplash.com/photo-1617538818560-53299d156bd6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
//   'https://images.unsplash.com/photo-1617505481649-8d0accca73d6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
//   'https://images.unsplash.com/photo-1617330070571-60434437a26c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
//   'https://images.unsplash.com/photo-1617504546842-5768342f1c46?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80',
//   'https://images.unsplash.com/photo-1617510031576-c9db88171057?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80',
//   'https://images.unsplash.com/photo-1617505907947-9cb31eb80183?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
//   'https://images.unsplash.com/photo-1617505481649-8d0accca73d6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
//   'https://images.unsplash.com/photo-1617330070571-60434437a26c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
//   'https://images.unsplash.com/photo-1617504546842-5768342f1c46?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80',
//   'https://images.unsplash.com/photo-1617510031576-c9db88171057?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80',
//   'https://images.unsplash.com/photo-1617505907947-9cb31eb80183?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
// ];

function MainPage() {
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [curGroupIdx, setCurGroupIdx] = useState(0);
  const [groupInfo, setGroupInfo] = useState({});
  const [photos, setPhotos] = useState([]);
  const history = useHistory();

  function buildPhotoList() {
    if (groups[curGroupIdx] !== undefined) {
      const { images } = groups[curGroupIdx];
      const tempList = [];
      images.forEach(img => tempList.push(img.URL));
      setPhotos(tempList);
    }
  }

  async function getUser(token, id) {
    try {
      API.getInfo(token, id)
        .then((res) => {
          setUser(res);
          // Leaving this for now. Later will need to set group to the group
          // list returned.
          setGroups(Groups);
        });
    } catch (e) {
      // TODO: Will probably need better error handling
      history.replace('/');
    }
  }

  function buildGroupInfo(groupList, index) {
    return { groupList, index };
  }

  // Only want this to trigger once to grab user token and id.
  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    getUser(token, id);
  }, []);

  // Need this to trigger when group changes
  // Builds photo array based on current group
  useEffect(() => {
    if (groups.length > 0) {
      buildPhotoList();
    }
  }, [groups]);

  // Build a new photo list whenever group index changes.
  useEffect(() => {
    if (groups !== undefined) {
      buildPhotoList();
    }
  }, [curGroupIdx]);

  // Updates when either the group list changes or current group.
  useEffect(() => {
    setGroupInfo(buildGroupInfo(groups, curGroupIdx));
  }, [groups, curGroupIdx]);

  return (
    <UserContext.Provider value={user}>
      <GroupContext.Provider value={groupInfo}>
        <div className="main-page-body">
          <Navbar />
          <div className="body-content">
            <Sidebar changeGroup={setCurGroupIdx}/>
              <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h1>{groups[curGroupIdx].title}</h1>
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
      </GroupContext.Provider>
    </UserContext.Provider>
  );
}

export default MainPage;
