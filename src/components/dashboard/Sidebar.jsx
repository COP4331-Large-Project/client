import '../../scss/sidebar.scss';
import React, { useContext, useEffect, useState } from 'react';
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
  const [inviteCode, setInviteCode] = useState('');
  const dispatch = useContext(GroupDispatchContext);
  // eslint-disable-next-line no-unused-vars
  const { groups, index } = useContext(GroupsStateContext);
  const openGroupModal = () => setGroupModalVisible(true);
  const closeGroupModal = () => setGroupModalVisible(false);

  useEffect(() => {
    if (groups[index] !== undefined) {
      setInviteCode(groups[index].inviteCode);
    }
  }, [groups, index]);

  function changeGroup(toIndex) {
    dispatch({ type: 'setIndex', payload: toIndex });
  }

  return (
    <Sider theme="light" className="sidebar">
      <Card className="sidebar-card">
        <InviteArea inviteCode={inviteCode}/>
        <GroupList onGroupClick={changeGroup} activeIndex={index} groups={groups} />
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
