import { SyntheticEvent, useState } from 'react';
import { Modal, Input, notification } from 'antd';
import Button from '../Button';
import '../../scss/join-group-button.scss';
import API from '../../api/API';
import { useGroups, useGroupsState } from '../../hooks/group';
import { useSocket } from '../../hooks/socket';
import GroupActions from '../../actions/GroupActions';

function JoinGroupButton(): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [groupCode, setGroupCode] = useState('');
  const { dispatch } = useGroups();
  const { groups } = useGroupsState();
  const socket = useSocket();

  function showModal() {
    setGroupCode('');
    setVisible(true);
  }

  function handleCancel() {
    setGroupCode('');
    setConfirmLoading(false);
    setVisible(false);
  }

  function parseInvite(str: string) {
    const strEnd = str.length;
    const linkEnd = strEnd - 33;
    const linkStart = linkEnd - 36;
    return str.substring(linkStart, linkEnd);
  }

  async function submitCode(event: SyntheticEvent) {
    event.preventDefault();
    let invite = groupCode;

    if (confirmLoading === true) {
      return;
    }

    setConfirmLoading(true);

    try {
      // Extracting the invite code from url if given a url
      if (invite.length < 36) {
        // potential invite is empty or too short to be an actual invite code
        throw new Error('Invalid invite code');
      } else if (invite.length > 36) {
        // Need to parse invite code out
        invite = parseInvite(invite);
      }

      const id = localStorage.getItem('id') as string;
      const group = await API.joinGroup(id, invite);

      dispatch(GroupActions.addGroup(group, groups.length));

      // Need to join the room for this group so we can listen
      // for incoming socket events.
      socket.emit('join', [group.id]);
    } catch (e) {
      let message: string;

      switch (e.status) {
      case 418:
        message = 'You\'re already a member of this group.';
        break;
      case 403:
      case 404:
        message = 'The group you’re looking for doesn’t exist.';
        break;
      default:
        message = 'An unknown error occurred, please try again.';
      }

      if (!e.status) {
        message = e.message;
      }

      notification.error({
        message: 'Error Joining Group',
        description: message,
        key: 'group-join-error',
      });

      setConfirmLoading(false);
      return;
    }

    notification.success({
      message: 'Joined Group',
      key: 'join-group-success',
    });

    setGroupCode('');
    setVisible(false);
    setConfirmLoading(false);
  }

  return (
    <div className="center">
      <Button className="joinButton" onClick={showModal}>
        Join Group
      </Button>
      <Modal
        centered
        title="Join group"
        visible={visible}
        onOk={submitCode}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: confirmLoading || !groupCode.trim(),
        }}
        okText="Join"
      >
        <form onSubmit={submitCode}>
          <p>Enter a group invite link or an invite code.</p>
          <Input
            autoFocus
            className="group-code-input"
            onChange={event => setGroupCode(event.target.value)}
            value={groupCode}
          />
        </form>
      </Modal>
    </div>
  );
}

export default JoinGroupButton;
