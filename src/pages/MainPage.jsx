import React, { useState, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import '../scss/main-page.scss';
import 'antd/dist/antd.css';
import { Button, notification } from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import Navbar from '../components/dashboard/Navbar.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import PhotoGrid from '../components/dashboard/PhotoGrid.jsx';
import API from '../api/API';
import UserContext from '../contexts/UserContext.jsx';
import GroupDispatchContext, {
  groupReducer,
} from '../contexts/GroupsContextDispatch.jsx';

import GroupsStateContext from '../contexts/GroupStateContext.jsx';

function MainPage() {
  const [user, setUser] = useState({});
  const [groupData, dispatch] = useReducer(groupReducer, {
    groups: [],
    index: 0,
  });
  const [photos, setPhotos] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');
  const history = useHistory();

  async function buildPhotoList() {
    const { groups, index } = groupData;

    if (groups.length === 0) {
      setPhotos([]);
      return;
    }

    setGroupTitle(groups[index].name);

    try {
      const res = await API.getGroupImages(groups[index].id);
      setPhotos(res.images.map(img => img.URL));
    } catch (err) {
      notification.error({
        message: 'Unexpected Error',
        description: `
          An error occurred while this group's images.
          Please try again later.
        `,
      });
    }
  }

  async function getUser(token, userId) {
    try {
      return await API.getInfo(token, userId);
    } catch (e) {
      // The user isn't authenticated, take them back
      // to the login page
      if (e.status === 403) {
        history.replace('/');
      }
    }

    return null;
  }

  async function getGroups(userId) {
    try {
      return await API.getGroups(userId);
    } catch (e) {
      return null;
    }
  }

  // Only want this to trigger once to grab user token and id.
  useEffect(async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    const userInfo = await getUser(token, id);

    if (!userInfo) {
      notification.error({
        message: 'Unexpected Error',
        description: `
          An unexpected error occurred while loading
          your profile. Please try again later.
        `,
      });
      return;
    }

    setUser(userInfo);

    const groups = await getGroups(id);

    if (!groups) {
      notification.error({
        message: 'Unexpected Error',
        description: `
          An error occurred while loading
          your groups. Please try again later.
        `,
      });
      return;
    }

    dispatch({ type: 'init', payload: groups });
  }, []);

  // Triggers when group changes
  // Builds photo array based on current group
  useEffect(() => {
    buildPhotoList();
  }, [groupData]);

  return (
    <UserContext.Provider value={user}>
      <GroupDispatchContext.Provider value={dispatch}>
        <GroupsStateContext.Provider value={groupData}>
          <div className="main-page-body">
            <Navbar />
            <div className="body-content">
              <Sidebar />
              <div className="main-content">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
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
