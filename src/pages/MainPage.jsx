import React, { useState, useEffect, useReducer } from 'react';
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
import GroupDispatchContext, { groupReducer } from '../contexts/GroupsContextDispatch.jsx';

import Groups from '../models/groups'; // Dummy group list.
import GroupsStateContext from '../contexts/GroupStateContext.jsx';

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
  const [groupData, dispatch] = useReducer(groupReducer, { groups: [], index: 0 });
  const { groups, index } = groupData;
  const [photos, setPhotos] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');
  const history = useHistory();

  function buildPhotoList() {
    if (groups !== undefined) {
      if (groups.length < 1) {
        setPhotos([]);
        return;
      }

      const { images } = groupData.groups[groupData.index];
      setPhotos(images.map(img => img.URL));
    }
  }

  async function getUser(token, id) {
    try {
      API.getInfo(token, id)
        .then((res) => {
          setUser(res);
          // Leaving this for now. Later will need to set group to the group
          // list returned.
          dispatch({ type: 'init', state: { groups: Groups } });
        });
    } catch (e) {
      // TODO: Will probably need better error handling
      history.replace('/');
    }
  }

  // Only want this to trigger once to grab user token and id.
  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    getUser(token, id);
    dispatch({ type: 'init', payload: Groups });
  }, []);

  // Need this to trigger when group changes
  // Builds photo array based on current group
  useEffect(() => buildPhotoList(), [groupData]);

  // Build a new photo list whenever group index changes.
  useEffect(() => {
    if (groups !== undefined) {
      buildPhotoList();
    }
  }, [index]);

  useEffect(() => {
    console.log('groups updated');
    if (groups !== undefined && groups[index] !== undefined) {
      setGroupTitle(groups[index].title);
    }
  }, [groups]);

  // Updates when either the group list changes or current group.
  // useEffect(() => {

  // }, [groupData]);

  return (
    <UserContext.Provider value={user}>
      <GroupDispatchContext.Provider value={dispatch}>
        <GroupsStateContext.Provider value={groupData}>
        <div className="main-page-body">
          <Navbar />
          <div className="body-content">
            <Sidebar />
              <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h1>{groupTitle}</h1>
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
        </GroupsStateContext.Provider>
      </GroupDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export default MainPage;
