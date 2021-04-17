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
  const [error, setError] = useState(null);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const userId = localStorage.getItem('id');
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

    // Prevent the user from accepting the invite
    // if they aren't logged in
    if (!userId) {
      setError({
        title: "Couldn't Join Group",
        description: (
          <span>
            You&apos;ll need to{' '}
            <Link to="/" className="card-link">
              log in
            </Link>{' '}
            before you can accept this invite.
          </span>
        ),
      });
      return;
    }

    // Make sure the user can't join the group if they're
    // already a member or the creator of the group.
    if (
      // prettier-ignore
      group.users.find(({ id }) => userId === id)
      || group.creator.id === userId
    ) {
      setError({
        title: "Couldn't Join Group",
        description: (
          <span>
            Well this is awkward. Looks like you&apos;re already a member of
            this group.{' '}
            <Link to="/main" className="card-link">
              Click here
            </Link>{' '}
            to go back.
          </span>
        ),
      });
      return;
    }

    setLoading(true);

    try {
      await API.joinGroup(userId, inviteCode);
    } catch (err) {
      setError({
        title: 'Unexpected Error',
        description: `
          An error occurred while joining this group.
          Please refresh the page and try again.`,
      });
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

    if (error) {
      return (
        <Alert
          type="error"
          message={error.title}
          description={error.description}
        />
      );
    }

    return (
      <Button onClick={acceptInvite} disabled={isLoading}>
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

    return (
      <>
        <Avatar src={group.profileIconURL} size={128}>
          {group.name[0]}
        </Avatar>
        <p className="text-muted avatar-title">
          You&apos;ve been invited to join a group
        </p>
        <h1 className="card-title">{group.name}</h1>
        <p className="text-muted">{getMemberText(group.users.length)}</p>
        {renderCardActions()}
      </>
    );
  };

  useEffect(async () => {
    if (!groupId) {
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
        {group && (
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
