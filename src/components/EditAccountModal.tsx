import '../scss/edit-account-modal.scss';
import { SyntheticEvent, useEffect, useState } from 'react';
// prettier-ignore
import {
  Modal,
  Avatar,
  Upload,
  Button,
  notification,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { useHistory } from 'react-router-dom';
import TextInput from './TextInput';
import API from '../api/API';
import { useUser, useUserState } from '../hooks/user';
import UserActions from '../actions/UserActions';
import { ModalProps } from './modal-types';

// 5 megabytes
const MAX_FILE_SIZE = 5e6;

function EditAccountModal({ visible = false, onClose }: ModalProps): JSX.Element {
  const history = useHistory();
  const user = useUserState();
  const { dispatch } = useUser();
  const [initials, setInitials] = useState('');
  const [profileImageSrc, setProfileImageSrc] = useState('');
  const [objectURL, setObjectURL] = useState('');
  const [password, setPassword] = useState('');
  const [isDeletingAccount, setDeletingAccount] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
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
      {isDeletingAccount ? 'Back' : 'Close'}
    </Button>,
    <Button
      form={isDeletingAccount ? 'delete-account-form' : 'profile-form'}
      key="submit"
      htmlType="submit"
      type={isDeletingAccount ? 'default' : 'primary'}
      danger={isDeletingAccount}
      loading={isLoading}
      disabled={isLoading || (isDeletingAccount && !password.trim())}
    >
      {isDeletingAccount ? 'Yes, Delete' : 'Save Changes'}
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
      // Release the image to clean up resources
      URL.revokeObjectURL(objectURL);
      setDeletingAccount(false);
      setProfileImageFile(null);
    }
  }, [visible]);

  const beforeUpload = (file: File) => {
    const url = URL.createObjectURL(file);

    setProfileImageSrc(url);
    setProfileImageFile(file);
    setObjectURL(url);

    // Returning false prevents ant from automatically uploading the
    // image right after the user selects an image
    return false;
  };

  // Returning false if the image is too large prevents the image
  // crop modal from appearing
  const verifyFileSize = (file: File) => {
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
        message: 'Email Sent',
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

  const deleteAccount = async (event: SyntheticEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      await API.deleteAccount(user.id, authToken ?? '', password);

      localStorage.clear();
      if (onClose) onClose();
      history.replace('/landing');
    } catch (err) {
      if (err.status === 403) {
        notification.error({
          message: 'Invalid Password',
          description: 'Your password is incorrect.',
        });
      } else {
        notification.error({
          message: 'Error Deleting Account',
          description:
            'An error occurred while deleting your account, please try again',
        });
      }
    }

    setLoading(false);
  };

  const updateProfile = async (event: SyntheticEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const payload = Object.fromEntries(formData) as Record<string, string>;
    const values = Object.values(payload);

    // Don't submit the form if every input field is empty
    if (values.every(value => !value.trim())) {
      return;
    }

    // Filter out any empty values from the payload
    Object.keys(payload).forEach(key => {
      if (!payload[key].trim()) {
        delete payload[key];
      }
    });

    setLoading(true);

    try {
      if (profileImageFile) {
        await API.updateProfilePicture(user.id, authToken ?? '', profileImageFile);
      }

      const userInfo = await API.updateAccount({
        ...payload,
        userId: user.id,
        token: authToken ?? '',
      });

      dispatch(UserActions.updateUser(userInfo));

      notification.success({
        key: 'update-success',
        message: 'Success',
        description: 'Your account was updated.',
        duration: 2,
      });

      if (onClose) onClose();
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
            grid
            rotate
            modalTitle="Edit Image"
            shape="round"
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
          <TextInput value={user.lastName} name="lastName" />
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
    <form onSubmit={deleteAccount} id="delete-account-form">
      <p>
        Are you sure you want to delete your account? This action is
        irreversible! Enter you password to confirm.
      </p>
      <TextInput
        value={password}
        onChange={setPassword}
        placeHolder="Password"
        type="password"
        name="password"
      />
    </form>
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

export default EditAccountModal;
