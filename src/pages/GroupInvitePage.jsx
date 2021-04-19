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
  const [accepted, setAccepted] = useState(false);
  const [group, setGroup] = useState(null);
  const [isLoadingGroup, setLoadingGroup] = useState(false);
  const [isAcceptingInvite, setAcceptingInvite] = useState(false);
  const [error, setError] = useState(null);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);

  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const userId = localStorage.getItem('id');
  const groupId = params.get('groupId');

  const getMemberText = numUsers => {
    if (numUsers === 1) {
      return `${numUsers.toLocaleString()} member`;
    }

    return `${numUsers.toLocaleString()} members`;
  };

  const acceptInvite = async () => {
    if (isAcceptingInvite) {
      return;
    }

    setAcceptingInvite(true);

    try {
      await API.joinGroup(userId, inviteCode);
    } catch (err) {
      const errorObj = {
        title: 'Unexpected Error',
        description: `
          An error occurred while joining this group.
          Please refresh the page and try again.`,
      };

      if (err.status === 418) {
        errorObj.title = "Couldn't Join Group";
        errorObj.description = (
          <span>
            Well this is awkward. Looks like you&apos;re already a member of
            this group.{' '}
            <Link to="/main" className="card-link">
              Click here
            </Link>{' '}
            to go back.
          </span>
        );
      }

      setError(errorObj);
      return;
    }

    setAcceptingInvite(false);
    setAccepted(true);
  };

  // Renders the invite button along with alerts that show if there
  // was an error while trying to join the group
  const renderCardActions = () => {
    if (error) {
      return (
        <Alert
          type="error"
          message={error.title}
          description={error.description}
        />
      );
    }

    if (!userId) {
      return (
        <Alert
          type="warning"
          message="You're Not Logged In"
          description={
            <span>
              Woah there slow down! You&apos;ll need to{' '}
              <Link to="/" className="card-link">
                log in
              </Link>{' '}
              before you can accept this invite.
            </span>
          }
        />
      );
    }

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

    return (
      <Button onClick={acceptInvite} disabled={isAcceptingInvite}>
        Accept Invite
      </Button>
    );
  };

  const renderCardContent = () => {
    if (isLinkInvalid) {
      return (
        <>
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
        </>
      );
    }

    if (group) {
      return (
        <>
          <Avatar src={group.thubmnail} size={128}>
            {group.name[0]}
          </Avatar>
          <p className="text-muted avatar-title">
            You&apos;ve been invited to join a group.
          </p>
          <h1 className="card-title">{group.name}</h1>
          {/* TODO: replace with real number */}
          <p className="text-muted">
            {getMemberText(Math.floor(Math.random() * 10_000))}
          </p>
          {renderCardActions()}
        </>
      );
    }

    return null;
  };

  useEffect(async () => {
    if (!groupId) {
      setIsLinkInvalid(true);
      return;
    }

    setLoadingGroup(true);

    try {
      const groupInfo = await API.getGroup(groupId);
      const { publicGroup, invitedUsers } = groupInfo;
      const isInvited = invitedUsers.find(user => user.id === userId);

      // Private groups need explicit invitation so we'll
      // hide the group from the user if the group is private
      if (!publicGroup && !isInvited) {
        setIsLinkInvalid(true);
        return;
      }

      setGroup(groupInfo);
    } catch (err) {
      setIsLinkInvalid(true);
    }

    setLoadingGroup(false);
  }, []);

  return (
    <div className="group-invite-page">
      <div className="card-container">
        {!isLoadingGroup && (
          <motion.div
            initial="hidden"
            animate="show"
            className="group-card-wrapper"
            transition={animationOpts}
            variants={animationVariants}
          >
            <Card className="group-card">{renderCardContent()}</Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

GroupInvitePage.propTypes = {
  inviteCode: PropTypes.string.isRequired,
};

export default GroupInvitePage;
