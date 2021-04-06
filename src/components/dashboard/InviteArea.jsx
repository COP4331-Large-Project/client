import '../../scss/invite-area.scss';
import React from 'react';
import { Button, message } from 'antd';
import { IoClipboardOutline } from 'react-icons/io5';
import PropTypes from 'prop-types';
import TextInput from '../TextInput.jsx';

// Prevent prettier from fighting with eslint when formatting is run
// prettier-ignore
const copyToClipboard = text => new Promise((resolve, reject) => {
  // Fallback in case navigator.clipboard isn't available
  // for the current browser
  if (!navigator.clipboard) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      reject(err);
    }

    document.body.removeChild(textArea);
    resolve();
    return;
  }

  navigator.clipboard.writeText(text).then(resolve).catch(reject);
});

function InviteArea({ inviteCode }) {
  const copyCode = () => {
    copyToClipboard(inviteCode)
      .then(() => message.success('Code copied to clipboard.'))
      .catch(() => message.error('Error copying code.'));
  };

  return (
    <div className="invite-area">
      <p className="title">Invite Link</p>
      <div className="input-wrapper">
        <TextInput className="invite-link-input" value={inviteCode} readOnly />
        <Button className="clipboard-btn" onClick={copyCode}>
          <IoClipboardOutline className="clipboard-icon" size={20} />
        </Button>
      </div>
      <p className="description">
        Once you join or create a group, you&apos;ll receive an invite link to
        share and invite other members.
      </p>
    </div>
  );
}

InviteArea.propTypes = {
  inviteCode: PropTypes.string,
};

InviteArea.defaultProps = {
  inviteCode: '',
};

export default InviteArea;
