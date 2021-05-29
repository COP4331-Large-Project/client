import '../scss/member-invite-modal.scss';
import { SyntheticEvent, useContext, useState } from 'react';
// prettier-ignore
import {
  Modal,
  Input,
  Button,
  List,
  notification,
} from 'antd';
import { AiOutlinePlus, AiOutlineUser, AiOutlineDelete } from 'react-icons/ai';
import GroupsStateContext from '../contexts/GroupStateContext';
import API from '../api/API';

type MemberInviteModalProps = {
  visible: boolean,
  onClose?: () => void
}

function MemberInviteModal({ visible = false, onClose }: MemberInviteModalProps): JSX.Element {
  const [memberEmail, setMemberEmail] = useState('');
  const [emails, setEmails] = useState(new Set<string>());
  const [isLoading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { groups, index } = useContext(GroupsStateContext);

  const addMember = (event: SyntheticEvent) => {
    event.preventDefault();

    const email = memberEmail.trim();
    const combined = new Set([...Array.from(emails), email]);

    if (email && !emails.has(email)) {
      setEmails(combined);
      setMemberEmail('');
    }
  };

  const removeMember = (email: string) => {
    const copy = new Set(emails);
    copy.delete(email);

    setEmails(copy);
  };

  const removeAllMembers = () => setEmails(new Set());

  const renderListFooter = () => {
    if (emails.size === 0) {
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

  const renderDeleteButton = (idx: string) => (
    <Button
      className="delete-member-btn"
      onClick={() => removeMember(idx)}
      disabled={isLoading}
    >
      <AiOutlineDelete size={20} />
    </Button>
  );

  const renderListItem = (email: string) => (
    <List.Item actions={[renderDeleteButton(email)]}>
      <List.Item.Meta title={email} avatar={<AiOutlineUser size={20} />} />
    </List.Item>
  );

  const inviteMembers = async () => {
    if (isLoading) {
      return;
    }

    setLoading(true);
    setHasError(false);

    try {
      const groupId = groups[index].id;

      await API.sendGroupInviteLink(groupId, [...Array.from(emails)]);

      notification.success({
        key: 'email-invite-success',
        message: 'Invites Sent',
      });

      setEmails(new Set());
      setMemberEmail('');
      if (onClose) onClose();
    } catch (err) {
      notification.success({
        key: 'email-invite-error',
        message: 'Error Sending Invites',
        description:
          'An error occurred while sending invites. Please try again.',
      });
      setHasError(true);
    }

    setLoading(false);
  };

  return (
    <Modal
      centered
      destroyOnClose
      title="Invite Members"
      className="member-invite-modal"
      visible={visible}
      onCancel={onClose}
      okText={isLoading ? 'Sending Invites...' : 'Send Invites'}
      cancelText={hasError ? 'Retry' : 'Close'}
      onOk={inviteMembers}
      okButtonProps={{
        disabled: emails.size === 0 || isLoading,
      }}
    >
      <form className="group-member-container" onSubmit={addMember}>
        <p className="input-title">Email</p>
        <Input.Search
          autoFocus
          type="email"
          onInput={event => setMemberEmail((event.target as HTMLInputElement).value)}
          value={memberEmail}
          placeholder="johndoe@example.com"
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
          dataSource={Array.from(emails)}
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

export default MemberInviteModal;
