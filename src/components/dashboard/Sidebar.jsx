import '../../scss/sidebar.scss';
import React, { useContext, useState } from 'react';
import { Layout } from 'antd';
import Card from '../Card.jsx';
import InviteArea from './InviteArea.jsx';
import GroupList from './GroupList.jsx';
import JoinGroupButton from './JoinGroupButton.jsx';
import Button from '../Button.jsx';
import CreateGroupModal from '../CreateGroupModal.jsx';
import GroupDispatchContext from '../../contexts/GroupsContextDispatch.jsx';
import GroupsStateContext from '../../contexts/GroupStateContext.jsx';

const { Sider } = Layout;

function Sidebar() {
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const dispatch = useContext(GroupDispatchContext);
  // eslint-disable-next-line no-unused-vars
  const { groups, index } = useContext(GroupsStateContext);
  const openGroupModal = () => setGroupModalVisible(true);
  const closeGroupModal = () => setGroupModalVisible(false);

  // const [groupList, setGroupList] = useState([]);

  // useEffect(() => {
  //   console.log(groups);
  //   setGroupList(groups);
  // }, [groups]);

  function changeGroup(toIndex) {
    dispatch({ type: 'setIndex', payload: toIndex });
  }

  return (
    <Sider theme="light" className="sidebar">
      <Card className="sidebar-card">
        <InviteArea inviteCode="xJwY394p" />
        <GroupList onGroupClick={changeGroup} groups={groups} />
        <div className="sidebar-actions">
          <JoinGroupButton />
          <Button onClick={openGroupModal}>Create Group</Button>
        </div>
        <CreateGroupModal
          visible={isGroupModalVisible}
          onClose={closeGroupModal}
        />
      </Card>
    </Sider>
  );
}

export default Sidebar;
