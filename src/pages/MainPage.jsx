/* eslint-disable */
import React, { useState, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import '../scss/main-page.scss';
import 'antd/dist/antd.css';
import { notification, Skeleton } from 'antd';
import { io } from 'socket.io-client';
import Navbar from '../components/dashboard/Navbar.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import PhotoGrid from '../components/dashboard/PhotoGrid.jsx';
import API, { BASE_URL } from '../api/API';
import UserContext from '../contexts/UserContext.jsx';
import GroupDispatchContext, {
  groupReducer,
} from '../contexts/GroupsContextDispatch.jsx';
import GroupsStateContext from '../contexts/GroupStateContext.jsx';
import GroupMenuButton from '../components/dashboard/GroupMenuButton.jsx';
import LoadingContext from '../contexts/LoadingContext.jsx';

const socket = io(BASE_URL, {
  transports: ['websocket'],
  upgrade: false,
});

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
  const [isLoadingGroups, setLoadingGroups] = useState(true);
  const [isLoadingImages, setLoadingImages] = useState(true);
  const [didLoad, setDidLoad] = useState(false);
  const history = useHistory();

  const loadingStates = {
    groupsLoading: isLoadingGroups,
    imagesLoading: isLoadingImages,
  };

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
    setLoadingGroups(true);

    try {
      const groups = await API.getGroups(userId);

      setLoadingGroups(false);

      return groups;
    } catch (e) {
      setLoadingGroups(false);

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
    socket.disconnect();

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    const userInfo = await getUser(token, id);

    if (!userInfo) {
      return;
    }

    setUser(userInfo);

    const groups = await getGroups(id);

    if (!groups) {
      setLoadingImages(false);
      return;
    }

    let images = [];

    if (groups.length > 0) {
      images = await getGroupImages(groups[0].id);
      setLoadingImages(false);
    } else {
      setLoadingImages(false);
    }

    // console.log('Main content loaded');

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

  function onImageUploaded(image, groupId) {
    const { groups, index } = groupData;

    console.log('Image uploaded', groupData.index);

    if (groups[index].id === groupId && image.creator !== user.id) {
      dispatch({
        type: 'addImage',
        payload: image,
      });
    }
  }

  function onGroupMemberJoin(joinCount, groupId) {
    const { groups } = groupData;
    const updatedGroup = groups.find(group => group.id === groupId);
    updatedGroup.memberCount += joinCount;

    dispatch({
      type: 'updateGroupMemberCount',
      payload: updatedGroup,
    });

    console.log(`${joinCount} users joined group ${groupId}`);
  }

  useEffect(() => {
    if (!didLoad) {
      return;
    }

    socket.connect();
    // console.log('After content load', { connected: socket.connected });

    const groupIds = groupData.groups.map(group => group.id);

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('join', groupIds);
    });

    // socket.on('users joined', (joinCount, groupId) => {
    //   console.log(`${joinCount} users joined group ${groupId}`);
    // });

    // return () => {
    //   console.log('Disconnected from socket');
    //   socket.disconnect();
    // };
  }, [didLoad]);

  // Triggers only when the selected group index changes.
  // In this case we'll set the group title and load the
  // images from this group.
  useEffect(async () => {
    const { groups, index } = groupData;

    if (groups.length > 0) {
      setDidLoad(true);

      socket.off('image uploaded');
      socket.off('users joined');
      socket.on('image uploaded', onImageUploaded);
      socket.on('users joined', onGroupMemberJoin);

      const group = groups[index];

      setGroupTitle(group.name);
      setLoadingImages(true);

      const images = await getGroupImages(group.id);

      setTimeout(() => {
        // Delaying this set state call makes the photo
        // grid mount animation a little bit smoother
        setLoadingImages(false);
      }, 500);

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
          <LoadingContext.Provider value={loadingStates}>
            <div className="main-page-body">
              <Navbar onLogout={logout} />
              <div className="body-content">
                <Sidebar />
                <div className="main-content">
                  <Skeleton
                    active
                    className="title-skeleton"
                    loading={isLoadingGroups}
                    paragraph={{ rows: 0 }}
                  >
                    <div className="group-title-row">
                      <h1 className="group-title" title={groupTitle}>
                        {groupTitle}
                      </h1>
                      {groupData.groups.length > 0 && (
                        <GroupMenuButton className="group-action-btn" />
                      )}
                    </div>
                  </Skeleton>
                  <PhotoGrid photos={groupData.images} />
                </div>
              </div>
            </div>
          </LoadingContext.Provider>
        </GroupsStateContext.Provider>
      </GroupDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export default MainPage;
