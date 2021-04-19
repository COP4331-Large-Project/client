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
import GroupDispatchContext, {
  groupReducer,
} from '../contexts/GroupsContextDispatch.jsx';

import Groups from '../models/groups'; // Dummy group list.
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

  function logout() {
    localStorage.clear();
    history.replace('/');
  }

  function buildPhotoList() {
    const { groups, index } = groupData;

    if (groups.length === 0) {
      setPhotos([]);
    } else {
      const { images } = groups[index];
      setGroupTitle(groups[index].title);
      setPhotos(images.map(img => img.URL));
    }
  }

  async function getUser(token, id) {
    try {
      const res = await API.getInfo(token, id);
      setUser(res);
      // Leaving this for now. Later will need to set group to the group
      // list returned.
      // dispatch({ type: 'init', state: { groups: Groups } });
    } catch (e) {
      // TODO: Will probably need better error handling
      history.replace('/');
    }
  }

  // Only want this to trigger once to grab user token and id.
  useEffect(async () => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    await getUser(token, id);
    dispatch({ type: 'init', payload: Groups });
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
            <Navbar onLogout={logout}/>
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
