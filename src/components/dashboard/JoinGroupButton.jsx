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
  const [code, setCode] = useState('');
  const dispatch = useContext(GroupContextDispatch);

  function showModal() {
    setCode('');
    setVisible(true);
  }

  function handleCancel() {
    setCode('');
    setConfirmLoading(false);
    setVisible(false);
  }

  function isURL(str) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$', 'i', // fragment locator
    );
    return !!pattern.test(str);
  }

  function getInviteCode(str) {
    const len = str.length;
    return str.substring(8, len);
  }

  async function submitCode(event) {
    event.preventDefault();

    if (confirmLoading === true) {
      return;
    }

    setConfirmLoading(true);

    try {
      // Extracting the invite code from url if given a url
      if (isURL(code) === true) {
        const { pathname } = new URL(code);
        const inviteCode = getInviteCode(pathname);
        setCode(inviteCode);
      }

      const id = localStorage.getItem('id');

      const group = await API.joinGroup(id, code);

      dispatch({
        type: 'addGroup',
        payload: group,
      });
    } catch (e) {
      setConfirmLoading(false);
      setCode('');
      notification.error({
        message: 'Error Joining Group',
        description: e.message,
        key: 'group-join-error',
      });
      return;
    }

    notification.success({
      message: 'Joined Group',
      key: 'join-groupsuccess',
    });
    setCode('');
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
            <p>Enter a group code.</p>
            <Input
              className="group-code-input"
              placeHolder='Example: xJwY394p'
              onChange={event => setCode(event.target.value)}
              value={code}
            />
        </form>
      </Modal>
    </div>
  );
}

export default JoinGroupButton;
