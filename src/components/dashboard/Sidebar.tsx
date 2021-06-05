import '../../scss/sidebar.scss';
import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import Card from '../Card';
import InviteArea from './InviteArea';
import GroupList from './GroupList';
import JoinGroupButton from './JoinGroupButton';
import Button from '../Button';
import CreateGroupModal from '../CreateGroupModal';
import { useGroups, useGroupsState } from '../../hooks/group';

const { Sider } = Layout;

function Sidebar(): JSX.Element {
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [groupId, setGroupId] = useState('');
  const { dispatch } = useGroups();
  const { groups, index } = useGroupsState();
  const openGroupModal = () => setGroupModalVisible(true);
  const closeGroupModal = () => setGroupModalVisible(false);

  useEffect(() => {
    if (groups.length > 0) {
      setInviteCode(groups[index].inviteCode);
      // TODO: Remove the _id check
      // eslint-disable-next-line no-underscore-dangle
      setGroupId(groups[index]._id || groups[index].id);
    } else {
      setInviteCode('');
      setGroupId('');
    }
  }, [groups, index]);

  function changeGroup(toIndex: number) {
    dispatch({ type: 'setIndex', payload: toIndex });
  }

  return (
    <Sider theme="light" className="sidebar">
      <Card className="sidebar-card">
        <InviteArea inviteCode={inviteCode} groupId={groupId} />
        <GroupList
          onGroupClick={changeGroup}
          activeIndex={index}
          groups={groups}
        />
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
