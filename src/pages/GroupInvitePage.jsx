import '../scss/group-invite-page.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { useHistory, Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import API from '../api/API';

const animationVariants = {
  hidden: {
    opacity: 0,
    transform: 'translateY(50%)',
  },
  show: {
    opacity: 1,
    transform: 'translateY(0%)',
  },
};

const animationOpts = {
  duration: 1.5,
  ease: [0.16, 1, 0.3, 1],
};

function GroupInvitePage({ inviteCode }) {
  const history = useHistory();
  const [accepted, setAccepted] = useState(false);
  const [group, setGroup] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');
  const groupId = params.get('groupId');

  const getMemberText = numUsers => {
    if (numUsers === 1) {
      return `${numUsers} member`;
    }

    return `${numUsers} members`;
  };

  const acceptInvite = async () => {
    if (isLoading) {
      return;
    }

    setLoading(true);

    try {
      await API.joinGroup(userId, inviteCode);
    } catch (err) {
      setHasError(true);
      return;
    }

    setAccepted(true);
  };

  const renderCardActions = () => {
    if (accepted) {
      return (
        <Alert
          type="success"
          message="Success!"
          description={
            <span>
              Welcome to your new group!{' '}
              <Link to="/main" className="card-link" replace>
                Click here
              </Link>{' '}
              to go to the main page.
            </span>
          }
        />
      );
    }

    if (hasError) {
      return (
        <Alert
          type="error"
          message="Unexpected Error"
          description={`
            An error occurred while joining this group.
            Please refresh the page and try again.
          `}
        />
      );
    }

    return (
      <Button onClick={acceptInvite} disabled={isLoading}>
        Accept Invite
      </Button>
    );
  };

  const renderContent = () => {
    if (isLinkInvalid) {
      return (
        <Card className="group-card">
          <h1 className="card-title">Invalid Invite</h1>
          <Alert
            type="error"
            className="invalid-code-alert"
            message="Group Not Found"
            description="The group you’re looking for doesn’t exist."
          />
          <Button variant="link" onClick={() => history.push('/main')}>
            Take me back
          </Button>
        </Card>
      );
    }

    if (!group) {
      return null;
    }

    return (
      <Card className="group-card">
        <Avatar src={group.profileIconURL} size={128}>
          {group.name[0]}
        </Avatar>
        <p className="text-muted avatar-title">
          You&apos;ve been invited to join a group
        </p>
        <h1 className="card-title">{group.name}</h1>
        <p className="text-muted">{getMemberText(group.users.length)}</p>
        {renderCardActions()}
      </Card>
    );
  };

  useEffect(async () => {
    if (!userId || !groupId) {
      setIsLinkInvalid(true);
      return;
    }

    try {
      const groupInfo = await API.getGroup(groupId);

      // Private groups need explicit invitation so we'll
      // hide the group from the user if the group is private
      if (!groupInfo.publicGroup) {
        setIsLinkInvalid(true);
        return;
      }

      setGroup(groupInfo);
    } catch (err) {
      setIsLinkInvalid(true);
    }
  }, []);

  return (
    <div className="group-invite-page">
      <div className="card-container">
        <motion.div
          initial="hidden"
          animate="show"
          className="group-card-wrapper"
          transition={animationOpts}
          variants={animationVariants}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}

GroupInvitePage.propTypes = {
  inviteCode: PropTypes.string.isRequired,
};

export default GroupInvitePage;
