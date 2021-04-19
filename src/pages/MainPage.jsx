// prettier-ignore
import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
} from 'react';
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

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function MainPage() {
  const [user, setUser] = useState({});
  // Using an initial value of -1 here so that groupData can
  // trigger updates when it's value is set to 0 on mount.
  // It'll be set to 0 even if there is at least ont group to load
  const [groupData, dispatch] = useReducer(groupReducer, {
    groups: [],
    index: -1,
  });
  const [photos, setPhotos] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');
  const history = useHistory();
  // Save the previously selected group index so that we don't
  // unnecessarily reload a group when either the same group is
  // clicked, or a new group is added
  const prevIndex = usePrevious(groupData.index);

  function logout() {
    localStorage.clear();
    history.replace('/');
  }

  async function buildPhotoList() {
    const { groups, index } = groupData;

    if (groups.length === 0) {
      setPhotos([]);
      return;
    }

    // Don't reload the photos if the currently
    // selected group hasn't changed
    if (prevIndex === index) {
      return;
    }

    setGroupTitle(groups[index].name);

    try {
      const res = await API.getGroupImages(groups[index].id);

      setPhotos(res.images.map(img => img.URL));
    } catch (err) {
      notification.error({
        key: 'error-build-photo',
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
      return;
    }

    setUser(userInfo);

    const groups = await getGroups(id);

    if (!groups) {
      notification.error({
        key: 'error-init',
        message: 'Unexpected Error',
        description: `
          An error occurred while loading
          your groups. Please try again later.
        `,
      });
      return;
    }

    // Set the index to -1 if there are no groups to load so
    // that it can be updated once a new group is added
    dispatch({
      type: 'init',
      payload: {
        groups,
        index: groups.length === 0 ? -1 : 0,
      },
    });
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
