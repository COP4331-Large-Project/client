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
  // Using an initial value of -1 here so that groupData can
  // trigger updates when its value is set to 0 on mount.
  // It'll be set to 0 if there is at least one group to load.
  const [groupData, dispatch] = useReducer(groupReducer, {
    groups: [],
    images: [],
    index: -1,
  });
  const [groupTitle, setGroupTitle] = useState('');
  const history = useHistory();

  function logout() {
    localStorage.clear();
    history.replace('/');
  }

  async function getUser(token, userId) {
    try {
      return await API.getInfo(token, userId);
    } catch (err) {
      if (err.status === 403) {
        // The user isn't authenticated, take them back
        // to the login page
        history.replace('/');
      } else {
        notification.error({
          key: 'error-get-user',
          message: 'Unexpected Error',
          description: `
          An unexpected error occurred while loading
          your profile. Please try again later.
        `,
        });
      }
    }

    return null;
  }

  async function getGroups(userId) {
    try {
      return API.getGroups(userId);
    } catch (e) {
      notification.error({
        key: 'error-init',
        message: 'Unexpected Error',
        description: `
          An error occurred while loading
          your groups. Please try again later.
        `,
      });
      return null;
    }
  }

  async function getGroupImages(groupId) {
    try {
      const res = await API.getGroupImages(groupId);
      return res.images;
    } catch (err) {
      notification.error({
        key: 'error-image',
        message: 'Unexpected Error',
        description: `
          An error occurred while loading images for
          this group. Please try again later.
        `,
      });
      return [];
    }
  }

  // Only want this to trigger once to grab user token and id.
  useEffect(async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    const userInfo = await getUser(token, id);

    if (!userInfo) {
      return;
    }

    setUser(userInfo);

    const groups = await getGroups(id);

    if (!groups) {
      return;
    }

    let images = [];

    if (groups.length > 0) {
      images = await getGroupImages(groups[0].id);
    }

    // Set the index to -1 if there are no groups to load so
    // that it can be updated once the first new group is added
    dispatch({
      type: 'init',
      payload: {
        index: groups.length === 0 ? -1 : 0,
        groups,
        images,
      },
    });
  }, []);

  // Triggers only when the selected group index changes.
  // In this case we'll set the group title and load the
  // images from this group.
  useEffect(async () => {
    const { groups, index } = groupData;

    if (groups.length > 0) {
      const group = groups[index];
      setGroupTitle(group.name);

      const images = await getGroupImages(group.id);

      dispatch({
        type: 'setImages',
        payload: images,
      });
    }
  }, [groupData.index]);

  return (
    <UserContext.Provider value={user}>
      <GroupDispatchContext.Provider value={dispatch}>
        <GroupsStateContext.Provider value={groupData}>
          <div className="main-page-body">
            <Navbar onLogout={logout} />
            <div className="body-content">
              <Sidebar />
              <div className="main-content">
                <div className="group-title-row">
                  <h1 className="group-title" title={groupTitle}>
                    {groupTitle}
                  </h1>
                  {groupData.groups.length > 0 && (
                    <Button className="group-action-btn" type="primary">
                      <BsThreeDots />
                    </Button>
                  )}
                </div>
                <PhotoGrid photos={groupData.images} />
              </div>
            </div>
          </div>
        </GroupsStateContext.Provider>
      </GroupDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export default MainPage;
