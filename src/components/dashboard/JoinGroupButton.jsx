import React, { useState, useContext } from 'react';
import {
  Modal,
  Input,
  notification,
} from 'antd';
import Button from '../Button.jsx';
import '../../scss/join-group-button.scss';
import API from '../../api/API';
import GroupContextDispatch from '../../contexts/GroupsContextDispatch.jsx';

function JoinGroupButton() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [input, setInput] = useState('');
  const dispatch = useContext(GroupContextDispatch);

  function showModal() {
    setInput('');
    setVisible(true);
  }

  function handleCancel() {
    setInput('');
    setConfirmLoading(false);
    setVisible(false);
  }

  function parseInvite(str) {
    const strEnd = str.length;
    const linkEnd = strEnd - 33;
    const linkStart = linkEnd - 36;
    return str.substring(linkStart, linkEnd);
  }

  async function submitCode(event) {
    event.preventDefault();
    let invite = input;

    if (confirmLoading === true) {
      return;
    }

    setConfirmLoading(true);

    try {
      // Extracting the invite code from url if given a url
      if (invite.length < 36) {
        // potential invite is empty or too short to be an actual invite code
        throw (new Error('Code cannot be empty or is too short to be an invite code.'));
      } else if (invite.length > 36) {
        // Need to parse invite code out
        invite = parseInvite(invite);
      }

      const id = localStorage.getItem('id');
      const group = await API.joinGroup(id, invite);

      dispatch({
        type: 'addGroup',
        payload: group,
      });
    } catch (e) {
      setConfirmLoading(false);
      notification.error({
        message: 'Error Joining Group',
        description: e.message,
        key: 'group-join-error',
      });
      return;
    }

    notification.success({
      message: 'Joined Group',
      key: 'join-group-success',
    });
    setInput('');
    setVisible(false);
    setConfirmLoading(false);
  }

  return (
    <div className='center'>
      <Button className='joinButton' onClick={showModal}>Join Group</Button>
      <Modal
        centered
        title='Join group'
        visible={visible}
        onOk={submitCode}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText='Join'
      >
        <form onSubmit={submitCode}>
            <p>Enter a group invite link or an invite code.</p>
            <Input
              className="group-code-input"
              placeHolder='Example: xJwY394p'
              onChange={event => setInput(event.target.value)}
              value={input}
            />
        </form>
      </Modal>
    </div>
  );
}

export default JoinGroupButton;
