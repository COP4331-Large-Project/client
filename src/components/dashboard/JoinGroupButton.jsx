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

  function submitCode(event) {
    event.preventDefault();
    setConfirmLoading(true);
    // Need to should be able to take in url or the invite code.
    // If url, do something like new URL(url) and get the path?
    try {
      setTimeout(() => {
        if (isURL(code) === true) {
          const { pathname } = new URL(code);
          const inviteCode = getInviteCode(pathname);
          console.log(inviteCode);
          console.log(pathname);
        } else {
          setCode('');
        }
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
