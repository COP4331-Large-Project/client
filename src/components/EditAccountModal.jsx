/* eslint-disable */
import '../scss/edit-account-modal.scss';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// prettier-ignore
import {
  Modal,
  Avatar,
  Upload,
  Button,
  notification,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import UserContext from '../contexts/UserContext.jsx';
import TextInput from './TextInput.jsx';
import API from '../api/API';

// 5 megabytes
const MAX_FILE_SIZE = 5e6;

function EditAccountModal({ visible, onClose }) {
  const user = useContext(UserContext);
  const [initials, setInitials] = useState('');
  const [profileImageSrc, setProfileImageSrc] = useState('');
  const [objectURL, setObjectURL] = useState('');
  const [password, setPassword] = useState('');
  const [isDeletingAccount, setDeletingAccount] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const authToken = localStorage.getItem('token');

  // Need to manually render the footer buttons so that
  // clicking on the submit button submits the form
  const modalFooter = [
    <Button
      onClick={isDeletingAccount ? () => setDeletingAccount(false) : onClose}
      key="close"
      className="cancel-btn"
      disabled={isLoading}
    >
      {isDeletingAccount ? 'Back' : 'Cancel'}
    </Button>,
    <Button
      form="profile-form"
      key="submit"
      htmlType="submit"
      type={isDeletingAccount ? 'default' : 'primary'}
      danger={isDeletingAccount}
      loading={isLoading}
      disabled={isLoading || (isDeletingAccount && !password.trim())}
    >
      {isDeletingAccount ? 'Yes, Delete' : 'Update Profile'}
    </Button>,
  ];

  useEffect(() => {
    const { firstName, lastName, imgURL } = user;

    if (firstName && lastName) {
      setInitials(`${firstName[0]}${lastName[0]}`);
    }

    if (imgURL) {
      setProfileImageSrc(imgURL);
    }
  }, [user]);

  useEffect(() => {
    if (!visible) {
      URL.revokeObjectURL(objectURL);
      setDeletingAccount(false);
      setProfileImageFile(null);
    }
  }, [visible]);

  const beforeUpload = file => {
    const url = URL.createObjectURL(file);

    setProfileImageSrc(url);
    setProfileImageFile(file);
    setObjectURL(url);

    return false;
  };

  const verifyFileSize = file => {
    if (file.size >= MAX_FILE_SIZE) {
      notification.error({
        key: 'file-too-large-error',
        message: 'File Too Large',
        description: `
          This file is too large to upload.
          The max file size is ${MAX_FILE_SIZE / 1e6} MB.
        `,
      });
      return false;
    }

    return true;
  };

  const sendPasswordResetEmail = async () => {
    setLoading(true);

    try {
      await API.passwordRecovery(user.email);

      notification.info({
        description:
          'Please check your email for a link to reset your password.',
      });
    } catch (err) {
      notification.error({
        message: 'Unexpected Error',
        description: 'An error occurred while requesting a password reset',
      });
    }

    setLoading(false);
  };

  const updateProfile = async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData);
    const values = Object.values(payload);

    if (values.every(key => !key.trim())) {
      return;
    }

    setLoading(true);

    try {
      if (profileImageFile) {
        await API.updateProfilePicture(user.id, authToken, profileImageFile);
      }

      await API.updateAccount({
        ...payload,
        userId: user.id,
        token: authToken,
      });

      notification.success({
        key: 'update-success',
        message: 'Success',
        description: 'Your account was updated.',
        duration: 3,
      });

      onClose();
    } catch (err) {
      notification.error({
        message: 'Error Updating Profile',
        description: 'An error occurred while updating your profile',
      });
    }

    setLoading(false);
  };

  const profileForm = (
    <>
      <form onSubmit={updateProfile} id="profile-form">
        <div className="profile-avatar">
          <Avatar size={120} src={profileImageSrc}>
            {initials}
          </Avatar>
          <ImgCrop
            modalTitle="Edit Image"
            shape="round"
            rotate
            grid
            beforeCrop={verifyFileSize}
          >
            <Upload
              className="upload"
              accept="image/png, image/jpeg, image/jpg, image/gif"
              beforeUpload={beforeUpload}
              showUploadList={false}
            >
              <Button type="link">Change Avatar</Button>
            </Upload>
          </ImgCrop>
        </div>
        <div className="input-group">
          <p className="input-title">First name</p>
          <TextInput value={user.firstName} name="firstName" />
        </div>
        <div className="input-group">
          <p className="input-title">Last name</p>
          <TextInput value={user.lastName} name="lasName" />
        </div>
        <div className="input-group">
          <p className="input-title">Username</p>
          <TextInput value={user.username} name="username" />
        </div>
        <div className="input-group">
          <p className="input-title">Email</p>
          <TextInput value={user.email} name="email" type="email" />
        </div>
      </form>
      <Button
        className="reset-password-btn"
        type="primary"
        onClick={sendPasswordResetEmail}
        disabled={isLoading}
      >
        Reset Password
      </Button>
      <Button
        className="delete-account-btn"
        disabled={isLoading}
        onClick={() => setDeletingAccount(true)}
        danger
      >
        Delete Account
      </Button>
    </>
  );

  const deleteConfirmation = (
    <>
      <p>
        Are you sure you want to delete your account? This action is
        irreversible! Enter you password to confirm.
      </p>
      <TextInput
        value={password}
        onChange={setPassword}
        placeHolder="Password"
        type="password"
      />
    </>
  );

  return (
    <Modal
      centered
      destroyOnClose
      maskClosable={false}
      onCancel={onClose}
      visible={visible}
      footer={modalFooter}
      title={isDeletingAccount ? 'Delete Account' : 'Your Account'}
      className="edit-account-modal"
    >
      {isDeletingAccount ? deleteConfirmation : profileForm}
    </Modal>
  );
}

EditAccountModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

EditAccountModal.defaultProps = {
  visible: false,
  onClose: () => {},
};

export default EditAccountModal;
