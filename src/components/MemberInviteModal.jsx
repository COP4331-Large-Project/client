/* eslint-disable */
import '../scss/member-invite-modal.scss';
import React, { useContext, useState } from 'react';
import { Modal, Input, Button, List } from 'antd';
import { AiOutlinePlus, AiOutlineUser, AiOutlineDelete } from 'react-icons/ai';
import PropTypes from 'prop-types';
import GroupsStateContext from '../contexts/GroupStateContext';

function MemberInviteModal({ visible, onClose }) {
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState(new Set());
  const [isLoading, setLoading] = useState(false);
  const { groups, index } = useContext(GroupsStateContext);

  const addMember = event => {
    event.preventDefault();

    const email = memberEmail.trim();
    const combined = new Set([...members, email]);

    if (email && !members.has(email)) {
      setMembers(combined);
      setMemberEmail('');
    }
  };

  const removeMember = email => {
    const copy = new Set(members);
    copy.delete(email);

    setMembers(copy);
  };

  const removeAllMembers = () => setMembers(new Set());

  const renderListFooter = () => {
    if (members.size === 0) {
      return null;
    }

    return (
      <List.Item className="group-member-list-footer">
        <Button
          className="remove-all-btn"
          disabled={isLoading}
          onClick={removeAllMembers}
        >
          Remove all
        </Button>
      </List.Item>
    );
  };

  const renderDeleteButton = index => (
    <Button
      className="delete-member-btn"
      onClick={() => removeMember(index)}
      disabled={isLoading}
    >
      <AiOutlineDelete size={20} />
    </Button>
  );

  const renderListItem = email => (
    <List.Item actions={[renderDeleteButton(email)]}>
      <List.Item.Meta title={email} avatar={<AiOutlineUser size={20} />} />
    </List.Item>
  );

  const inviteMembers = () => {
    setLoading(true);
  };

  const onRequestClose = () => {
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      centered
      title="Invite Members"
      className="member-invite-modal"
      visible={visible}
      onCancel={() => onRequestClose()}
      okText={isLoading ? 'Sending Invites...' : 'Send Invites'}
      onOk={inviteMembers}
      okButtonProps={{
        disabled: members.size === 0 || isLoading,
      }}
    >
      <form className="group-member-container" onSubmit={addMember}>
        <p className="input-title">Email</p>
        <Input.Search
          type="email"
          onInput={event => setMemberEmail(event.target.value)}
          value={memberEmail}
          placeHolder="johndoe@example.com"
          disabled={isLoading}
          enterButton={
            <Button
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              className="add-btn"
            >
              <AiOutlinePlus size={20} className="input-icon" />
            </Button>
          }
        />
        <List
          className="group-member-list"
          dataSource={members}
          renderItem={renderListItem}
          footer={renderListFooter()}
        />
        <p className="description">
          Users added here will receive an invite link to join your group:{' '}
          {groups[index].name}.
        </p>
      </form>
    </Modal>
  );
}

MemberInviteModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

MemberInviteModal.defaultProps = {
  visible: false,
  onClose: () => {},
};

export default MemberInviteModal;
