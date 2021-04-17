import '../scss/verify-email.modal.scss';
import React, { useState } from 'react';
// prettier-ignore
import {
  notification,
  Modal,
  Input,
  Button,
} from 'antd';
import PropTypes from 'prop-types';
import API from '../api/API';

function VerifyEmailModal({ visible, onClose }) {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const resendEmail = async event => {
    event.preventDefault();

    setLoading(true);

    try {
      await API.requestEmailVerificationLink(email);
      notification.success({
        message: 'Success!',
        description: 'An email was sent to your inbox.',
        key: 'email-verify-notification',
      });
    } catch (e) {
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        key: 'email-verify-notification',
      });
    }

    setLoading(false);
  };

  return (
    <Modal
      centered
      destroyOnClose
      title="Verify Your Email"
      className="verify-email-modal"
      okText={isLoading ? 'Sending' : 'Resend'}
      cancelText="Close"
      visible={visible}
      okButtonProps={{
        loading: isLoading,
        disabled: isLoading || !email.trim(),
        htmlType: 'submit',
      }}
      onOk={resendEmail}
      onCancel={onClose}
      footer={[
        <Button onClick={onClose} key="close">Close</Button>,
        <Button
          form="verify-email-form"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={isLoading}
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? 'Sending...' : 'Resend'}
        </Button>,
      ]}
    >
      <form onSubmit={resendEmail} id="verify-email-form">
        <p className="input-title">Email</p>
        <Input
          onInput={event => setEmail(event.target.value)}
          disabled={isLoading}
          type="email"
        />
        <p className="modal-body">
          Looks like you haven&apos;t verified your email yet. Check your inbox
          or enter your email here if you didn&apos;t receive a verification
          link, then try logging in again.
        </p>
      </form>
    </Modal>
  );
}

VerifyEmailModal.propTypes = {
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};

VerifyEmailModal.defaultProps = {
  onClose: () => {},
  visible: false,
};

export default VerifyEmailModal;
