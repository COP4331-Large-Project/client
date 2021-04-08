import React from 'react';
import { Modal, Input } from 'antd';
import Button from '../Button.jsx';
import '../../scss/join-group.scss';
// import { func } from 'prop-types';

function JoinGroup() {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');
  const [code, setCode] = React.useState('');

  function showModal() {
    setCode('');
    setVisible(true);
  }

  function handleCancel() {
    setCode('');
    setVisible(false);
  }

  function submitCode(event) {
    event.preventDefault();
    setConfirmLoading(true);

    try {
      // TODO: Hook up join group api
      // Dummy time out to simulate async
      setTimeout(() => {
        setCode('');
        setVisible(false);
        setConfirmLoading(false);
      }, 1000);
    } catch (e) {
      setErrorText(e);
    }
  }

  return (
    <div className='center'>
      <Button className='joinButton' onClick={showModal}>Join Group</Button>
      <Modal
        title='Join group'
        visible={visible}
        onOk={submitCode}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText='Join'
      >
        <form onSubmit={submitCode}>
            <p>Enter an eight character group code.</p>
            <Input
              placeHolder='Example: xJwY394p'
              onChange={(c) => { setCode(code + c.nativeEvent.data); }}
              value={code}
            />
            <p>
              {errorText}
            </p>
        </form>
      </Modal>
    </div>
  );
}

export default JoinGroup;
