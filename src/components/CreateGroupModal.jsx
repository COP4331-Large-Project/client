import '../scss/create-group-modal.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// prettier-ignore
import {
  Modal,
  Checkbox,
  Button,
  List,
  Input,
  notification,
} from 'antd';
import { AiOutlinePlus, AiOutlineUser, AiOutlineDelete } from 'react-icons/ai';

function CreateGroupModal({ visible, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [isPrivateChecked, setPrivateChecked] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState(new Set());
  const [isLoading, setLoading] = useState(false);

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

  const createGroup = () => {
    if (isLoading) {
      return;
    }

    setLoading(true);

    // TODO: Make API request Here - The below is just testing
    setTimeout(() => {
      setLoading(false);
      notification.error({
        message: 'Error creating group',
        description: "Yikes, this feature hasn't been implemented yet",
      });
    }, 3000);
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

  const renderMemberInput = () => {
    if (!isPrivateChecked) {
      return null;
    }

    return (
      <form className="group-member-container" onSubmit={addMember}>
        <p className="input-title">
          Add Members <span className="subtitle">(Optional)</span>
        </p>
        <Input.Search
          type="email"
          onInput={event => setMemberEmail(event.target.value)}
          value={memberEmail}
          placeHolder="johndoe@example.com"
          disabled={isLoading}
          enterButton={
            <Button type="primary" htmlType="submit" disabled={isLoading}>
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
      </form>
    );
  };

  return (
    <Modal
      centered
      visible={visible}
      title="Create Group"
      className="create-group-modal"
      onCancel={onClose}
      okButtonProps={{
        disabled: groupName.trim().length === 0,
        loading: isLoading,
      }}
      onOk={createGroup}
      okText={isLoading ? 'Creating group...' : 'Create'}
    >
      <p className="input-title">Group Name</p>
      <Input
        onInput={event => setGroupName(event.target.value)}
        disabled={isLoading}
      />
      {renderMemberInput()}
      <Checkbox
        className="private-checkbox"
        onChange={event => setPrivateChecked(event.target.checked)}
        disabled={isLoading}
      >
        Private
      </Checkbox>
      <p className="description">
        Public groups can be joined through an invite link. Private groups can
        only be joined with an invite link after the owner grants them access.
      </p>
    </Modal>
  );
}

CreateGroupModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

CreateGroupModal.defaultProps = {
  visible: false,
  onClose: () => {},
};

export default CreateGroupModal;
