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
  const [code, setCode] = React.useState('');

  function showModal() {
    setVisible(true);
  }

  function handleCancel() {
    setVisible(false);
  }

  function submitCode(event) {
    event.preventDefault();
    setConfirmLoading(true);

    try {
      // Dummy time out to simulate async
      setTimeout(() => {
        alert(code);
        setCode('');
        setVisible(false);
        setConfirmLoading(false);
      }, 2000);
    } catch (e) {
      setErrorText(e);
    }
  }

  return (
    <div className='center'>
      <Button onClick={showModal}>Join Group</Button>
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
            <TextInput
              placeHolder='Example: xJwY394p'
              onChange={(c) => { setCode(c); }}
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
