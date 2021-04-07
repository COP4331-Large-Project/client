import React from 'react';
import { Modal } from 'antd';
import Button from '../Button.jsx';
import '../../scss/join-group.scss';
import TextInput from '../TextInput.jsx';
// import { func } from 'prop-types';

function JoinGroup() {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

  function showModal(event) {
    event.preventDefault();
    // Show the modal first.
    setVisible(true);
  }

  function handleOk() {
    setConfirmLoading(true);
    try {
      setTimeout(() => {
        setVisible(false);
        setConfirmLoading(false);
      }, 2000);
    } catch (e) {
      setErrorText(e);
    }
  }

  function handleCancel() {
    setVisible(false);
  }

  return (
    <div className='center'>
      <Button onClick={showModal}>Join Group</Button>
      <Modal
        title='Enter a group code'
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form>
            <p>Example: xJwY394p</p>
            <TextInput/>
            <p>
              {errorText}
            </p>
        </form>
      </Modal>
    </div>
  );
}

export default JoinGroup;
