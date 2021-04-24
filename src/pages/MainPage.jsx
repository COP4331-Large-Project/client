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
import { notification, Skeleton } from 'antd';
import { io } from 'socket.io-client';
import Navbar from '../components/dashboard/Navbar.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import PhotoGrid from '../components/dashboard/PhotoGrid.jsx';
import API, { BASE_URL } from '../api/API';
import UserContext from '../contexts/UserStateContext.jsx';
import GroupDispatchContext, {
  groupReducer,
} from '../contexts/GroupsContextDispatch.jsx';
import GroupsStateContext from '../contexts/GroupStateContext.jsx';
import GroupMenuButton from '../components/dashboard/GroupMenuButton.jsx';
import UserContextDispatch, {
  userReducer,
} from '../contexts/UserContextDispatch.jsx';
import LoadingContext from '../contexts/LoadingContext.jsx';
import SocketContext from '../contexts/SocketContext.jsx';

const socket = io(BASE_URL, {
  transports: ['websocket'],
  upgrade: false,
});

// Used to get the previous value of state.
const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

function MainPage() {
  // Using an initial value of -1 here so that groupData can
  // trigger updates when its value is set to 0 on mount.
  // It'll be set to 0 if there is at least one group to load.
  const [groupData, groupDispatch] = useReducer(groupReducer, {
    groups: [],
    images: [],
    index: -1,
  });
  const [user, userDispatch] = useReducer(userReducer, {});
  const [groupTitle, setGroupTitle] = useState('');
  const [isLoadingGroups, setLoadingGroups] = useState(true);
  const [isLoadingImages, setLoadingImages] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const history = useHistory();
  const prevGroupData = usePrevious(groupData);

  const loadingStates = {
    groupsLoading: isLoadingGroups,
    imagesLoading: isLoadingImages,
  };

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

  const onImageUploaded = (image, username, groupId) => {
    const { groups, index } = groupData;

    // Ensures that we don't dispatch an add image event if the user isn't
    // currently viewing the group where the image was added or if the
    // person who uploaded the image is the current user
    if (groups[index].id === groupId && image.creator !== user.id) {
      groupDispatch({
        type: 'addImage',
        payload: image,
      });

      notification.info({
        key: 'image-upload-notification',
        duration: 3,
        description: `${username} uploaded an image`,
      });
    }
  };

  const onMemberCountChange = (username, groupId, hasJoined) => {
    const groups = [...groupData.groups];
    const updatedIndex = groups.findIndex(group => group.id === groupId);

    if (updatedIndex === -1) {
      return;
    }

    // Only show the notification if the group the new user joined is the
    // same group the user has currently selected
    if (updatedIndex === groupData.index && user.username !== username) {
      notification.info({
        key: 'member-change-notification',
        duration: 3,
        description: `${username} ${hasJoined ? 'joined' : 'left'} your group.`,
      });
    }

    if (hasJoined) {
      groups[updatedIndex].memberCount += 1;
    } else {
      groups[updatedIndex].memberCount -= 1;
    }

    if (user.username !== username) {
      groupDispatch({
        type: 'updateGroupMemberCount',
        payload: groups,
      });
    }
  };

  const updatePage = async () => {
    const { groups, index } = groupData;
    const group = groups[index];
    // eslint-disable-next-line no-underscore-dangle
    const creatorId = group.creator.id || group.creator._id;

    setIsOwner(creatorId === user.id);
    setGroupTitle(group.name);
    setLoadingImages(true);

    const images = await getGroupImages(group.id);

    setTimeout(() => {
      // Delaying this set state call makes the photo
      // grid mount animation a little bit smoother
      setLoadingImages(false);
    }, 500);

    groupDispatch({
      type: 'setImages',
      payload: images,
    });
  };

  // Only want this to trigger once to grab user token and id.
  useEffect(async () => {
    socket.disconnect();

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    const userInfo = await getUser(token, id);

    if (!userInfo) {
      return;
    }

    userDispatch({
      type: 'updateUser',
      payload: userInfo,
    });

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

    // Each group in groups contains a creator field. Problem is that creator is
    // stored in an array of size one. So for each group in groups, we lift the
    // creator object out of the array and also rename the id field from _id to id.
    groups.forEach(group => {
      const { creator } = group;

      if (creator[0]) {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        group.creator.id = creator[0]._id;
        // eslint-disable-next-line prefer-destructuring, no-param-reassign
        group.creator = creator[0];
      }
    });

    socket.connect();

    socket.on('connect', () => {
      socket.emit(
        'join',
        groups.map(group => group.id),
      );
    });

    // Set the index to -1 if there are no groups to load so
    // that it can be updated once the first new group is added
    groupDispatch({
      type: 'init',
      payload: {
        index: groups.length === 0 ? -1 : 0,
        groups,
        images,
      },
    });
  }, []);

  // We only want this to trigger when the selected group index changes.
  // In this case we'll set the group title and load the images
  // from this group. Any other dependencies here would cause
  // the page to fetch images on every change.
  useEffect(async () => {
    const { groups } = groupData;

    if (groups.length === 0) {
      setGroupTitle('');
      setIsOwner(false);
      groupDispatch({
        type: 'setImages',
        payload: [],
      });

      return;
    }

    if (groups.length > 0) {
      socket.off('image uploaded');
      socket.off('user joined');
      socket.off('user removed');

      socket.on('image uploaded', onImageUploaded);
      socket.on('user joined', (username, groupId) => {
        onMemberCountChange(username, groupId, true);
      });
      socket.on('user removed', (username, groupId) => {
        onMemberCountChange(username, groupId, false);
      });

      updatePage();
    }
  }, [groupData.index]);

  useEffect(async () => {
    if (!groupData.groups || !prevGroupData) {
      return;
    }

    const { groups, index } = groupData;

    // This is an edge case. Sometimes deleting a group
    // doesn't change the index so we need to manually update
    // the photo list in that case.
    if (
      // prettier-ignore
      prevGroupData.groups.length > groups.length
      && prevGroupData.index === index
    ) {
      updatePage();
    }
  }, [groupData.groups]);

  return (
    <SocketContext.Provider value={socket}>
      <UserContext.Provider value={user}>
        <UserContextDispatch.Provider value={userDispatch}>
          <GroupDispatchContext.Provider value={groupDispatch}>
            <GroupsStateContext.Provider value={groupData}>
              <LoadingContext.Provider value={loadingStates}>
                <div className="main-page-body">
                  <Navbar />
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
                            <GroupMenuButton
                              className="group-action-btn"
                              isOwner={isOwner}
                            />
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
        </UserContextDispatch.Provider>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
}

export default MainPage;
