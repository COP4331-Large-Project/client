import '../scss/verify-email.modal.scss';
import { SyntheticEvent, useState } from 'react';
// prettier-ignore
import {
  notification,
  Modal,
  Input,
  Button,
} from 'antd';
import API from '../api/API';

type VerifyEmailModalProps = {
  visible: boolean;
  onClose: () => void;
};

function VerifyEmailModal({ visible = false, onClose }: VerifyEmailModalProps): JSX.Element {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailValid, setEmailValid] = useState(false);

  const resendEmail = async (event: SyntheticEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      await API.requestEmailVerificationLink(email.trim());
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
      visible={visible}
      onOk={resendEmail}
      onCancel={onClose}
      footer={[
        <Button onClick={onClose} key="close">
          Close
        </Button>,
        <Button
          form="verify-email-form"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={isLoading}
          disabled={isLoading || !isEmailValid || !email.trim()}
        >
          {isLoading ? 'Sending...' : 'Resend'}
        </Button>,
      ]}
    >
      <form
        onSubmit={resendEmail}
        id="verify-email-form"
        onChange={event => setEmailValid(event.currentTarget.validity.valid)}
      >
        <p className="input-title">Email</p>
        <Input
          onInput={event => setEmail(event.currentTarget.value)}
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

export default VerifyEmailModal;
