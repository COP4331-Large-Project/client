// prettier-ignore
import {
  useState,
  useEffect,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import '../scss/main-page.scss';
import 'antd/dist/antd.css';
import { notification, Skeleton } from 'antd';
import { io } from 'socket.io-client';
import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import PhotoGrid from '../components/dashboard/PhotoGrid';
import API, { BASE_URL } from '../api/API';
import { useGroups, useGroupsState } from '../hooks/group';
import GroupMenuButton from '../components/dashboard/GroupMenuButton';
import { useUser, useUserState } from '../hooks/user';
import { LoadingProvider } from '../contexts/LoadingContext';
import { SocketProvider } from '../contexts/SocketContext';
import GroupActions from '../actions/GroupActions';
import UserActions from '../actions/UserActions';
import { Image } from '../types';

const socket = io(BASE_URL, {
  transports: ['websocket'],
  upgrade: false,
});

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function MainPage() {
  const groupData = useGroupsState();
  const { dispatch: groupDispatch } = useGroups();
  const user = useUserState();
  const { dispatch: userDispatch } = useUser();
  const [groupTitle, setGroupTitle] = useState('');
  const [isLoadingGroups, setLoadingGroups] = useState(true);
  const [isLoadingImages, setLoadingImages] = useState(true);
  const [isGroupOwner, setIsGroupOwner] = useState(false);
  const history = useHistory();
  const prevGroupData = usePrevious(groupData);

  const loadingStates = {
    groupsLoading: isLoadingGroups,
    imagesLoading: isLoadingImages,
  };

  async function getUser(token: string, userId: string) {
    try {
      return await API.getInfo(token, userId);
    } catch (err) {
      if (err.status === 403) {
        // The user isn't authenticated, take them back
        // to the login page
        history.replace('/landing');
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

  async function getGroups(userId: string) {
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

  async function getGroupImages(groupId: string) {
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

  const onImageUploaded = (image: Image, username: string, groupId: string) => {
    const { groups, index } = groupData;

    // Ensures that we don't dispatch an add image event if the user isn't
    // currently viewing the group where the image was added or if the
    // person who uploaded the image is the current user
    if (groups[index].id === groupId && image.creator !== user.id) {
      groupDispatch(GroupActions.addImage(image));

      notification.info({
        key: 'image-upload-notification',
        duration: 3,
        description: `${username} uploaded an image`,
        message: `${username} uploaded an image`,
      });
    }
  };

  const onMemberCountChange = (username: string, groupId: string, hasJoined: boolean) => {
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
        message: `${username} ${hasJoined ? 'joined' : 'left'} your group.`,
      });
    }

    if (hasJoined) {
      groups[updatedIndex].memberCount += 1;
    } else {
      groups[updatedIndex].memberCount -= 1;
    }

    if (user.username !== username) {
      groupDispatch(GroupActions.updateGroupMemberCount(groups));
    }
  };

  const updatePage = async () => {
    const { groups, index } = groupData;
    const group = groups[index];
    // eslint-disable-next-line no-underscore-dangle
    const creatorId = group.creator.id || group.creator._id;

    setIsGroupOwner(creatorId === user.id);
    setGroupTitle(group.name);
    setLoadingImages(true);

    const images = await getGroupImages(group.id);

    setTimeout(() => {
      // Delaying this set state call makes the photo
      // grid mount animation a little bit smoother
      setLoadingImages(false);
    }, 500);

    groupDispatch(GroupActions.setImages(images));
  };

  // Only want this to trigger once to grab user token and id.
  useEffect(() => {
    void (async () => {
      socket.disconnect();

      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');

      const userInfo = await getUser(token ?? '', id ?? '');

      if (!userInfo) {
        return;
      }

    userDispatch(UserActions.updateUser(userInfo));

      const groups = await getGroups(id ?? '');

      if (!groups) {
        setLoadingImages(false);
        return;
      }

      let images: Image[] = [];

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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (creator[0]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          group.creator.id = creator[0]._id;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
      groupDispatch(GroupActions.init(groups, images, groups.length === 0 ? -1 : 0));
    })();
  }, []);

  // We only want this to trigger when the selected group index changes.
  // In this case we'll set the group title and load the images
  // from this group. Any other dependencies here would cause
  // the page to fetch images on every change.
  useEffect(() => {
    const { groups } = groupData;

    if (groups.length === 0) {
      setGroupTitle('');
      setIsGroupOwner(false);

      groupDispatch(GroupActions.setImages([]));

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

  useEffect(() => {
    if (!groupData.groups || !prevGroupData) {
      return;
    }

    const { groups, index } = groupData;

    // This is an edge case. Sometimes deleting a group
    // doesn't change the index so we need to manually update
    // the photo list in that case.
    if (
      // prettier-ignore
      prevGroupData?.groups.length > groups.length
      && prevGroupData?.index === index
    ) {
      void updatePage();
    }
  }, [groupData.groups]);

  return (
    <SocketProvider value={socket}>
      <LoadingProvider value={loadingStates}>
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
                      isOwner={isGroupOwner}
                    />
                  )}
                </div>
              </Skeleton>
              <PhotoGrid
                photos={groupData.images}
                isGroupOwner={isGroupOwner}
              />
            </div>
          </div>
        </div>
      </LoadingProvider>
    </SocketProvider>
  );
}

export default MainPage;
