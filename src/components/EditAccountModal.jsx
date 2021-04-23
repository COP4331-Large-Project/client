/* eslint-disable */
import '../scss/edit-account-modal.scss';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Avatar, Upload, Button } from 'antd';
import UserContext from '../contexts/UserContext';
import TextInput from './TextInput';

function EditAccountModal({ visible, onClose }) {
  const user = useContext(UserContext);
  const [initials, setInitials] = useState('');
  // Need to manually render the footer buttons so that
  // clicking on the submit button submits the form
  const modalFooter = [
    <Button onClick={onClose} key="close">
      Close
    </Button>,
    <Button form="profile-form" key="submit" htmlType="submit" type="primary">
      Update Profile
    </Button>,
  ];

  const beforeUpload = file => {
    console.log(file);
    return false;
  };

  const updateProfile = event => {
    event.preventDefault();
  };

  useEffect(() => {
    const { firstName, lastName } = user;

    if (firstName && lastName) {
      setInitials(`${firstName[0]}${lastName[0]}`);
    }
  }, [user.firstName, user.lastName]);

  return (
    <Modal
      centered
      maskClosable={false}
      onCancel={onClose}
      visible={visible}
      footer={modalFooter}
      title="Your Account"
      cancelText="Close"
      okText="Update Profile"
      className="edit-account-modal"
    >
      <form onSubmit={updateProfile} id="profile-form">
        <div className="profile-avatar">
          <Avatar size={100} src={user.imgURL}>
            {initials}
          </Avatar>
          <Upload
            accept="image/png, image/jpeg, image/jpg"
            beforeUpload={beforeUpload}
            itemRender={() => <div />}
          >
            <Button type="link">Upload profile picture</Button>
          </Upload>
        </div>
        <div className="input-group">
          <p className="input-title">First name</p>
          <TextInput value={user.firstName} />
        </div>
        <div className="input-group">
          <p className="input-title">Last name</p>
          <TextInput value={user.lastName} />
        </div>
        <div className="input-group">
          <p className="input-title">Email</p>
          <TextInput value={user.email} />
        </div>
      </form>
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
