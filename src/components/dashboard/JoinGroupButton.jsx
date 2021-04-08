import React from 'react';
import { Modal, Input, Alert } from 'antd';
import Button from '../Button.jsx';
import '../../scss/join-group-button.scss';
// import { func } from 'prop-types';

function JoinGroupButton() {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');
  const [code, setCode] = React.useState('');

  function showModal() {
    setCode('');
    setVisible(true);
  }

  function handleCancel() {
    setCode('');
    setHasError(false);
    setConfirmLoading(false);
    setVisible(false);
  }

  function closeAlert() {
    setErrorText('');
    setHasError(false);
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
      setErrorText(e.message);
      setConfirmLoading(false);
      setHasError(true);
    }
  }

  return (
    <div className='center'>
      <Button className='joinButton' onClick={showModal}>Join Group</Button>
      <Modal
        className="join-group-modal"
        title='Join group'
        visible={visible}
        onOk={submitCode}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText='Join'
      >
        <form onSubmit={submitCode}>
            <p>Enter a group code.</p>
            {hasError && (
              <Alert
              closable
              message={errorText}
              type='error'
              onClose={ closeAlert }
            />
            )}
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
