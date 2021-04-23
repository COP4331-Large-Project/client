import React, { useState, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import '../scss/main-page.scss';
import 'antd/dist/antd.css';
import { notification, Skeleton } from 'antd';
import Navbar from '../components/dashboard/Navbar.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import PhotoGrid from '../components/dashboard/PhotoGrid.jsx';
import API from '../api/API';
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

  // Only want this to trigger once to grab user token and id.
  useEffect(async () => {
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

      // eslint-disable-next-line
      group.creator.id = creator[0]._id;
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      group.creator = creator[0];
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

  // Triggers only when the selected group index changes.
  // In this case we'll set the group title and load the
  // images from this group.
  useEffect(async () => {
    const { groups, index } = groupData;

    try {
      if (groups.length > 0) {
        const group = groups[index];

        setGroupTitle(group.name);
        setLoadingImages(true);
        /* eslint no-underscore-dangle: */
        setGroupTitle(group.name);
        setLoadingImages(true);
        setIsOwner(group.creator._id === user.id);
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
      }
    } catch (e) {
      notification.error({
        description: e.message,
      });
    }
  }, [groupData.groups, groupData.index]);

  return (
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
                          <GroupMenuButton className="group-action-btn" isOwner={isOwner}/>
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
  );
}

export default MainPage;
