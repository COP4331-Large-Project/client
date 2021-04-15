import '../scss/group-invite-page.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { useHistory, Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import API from '../api/API';

const DEBUG_GROUP = {
  name: 'Architecture',
  members: 7,
  profileIconURL:
    'https://images.unsplash.com/photo-1617516202907-ff75846e6667?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1828&q=80',
};

function GroupInfo({ profileIconURL, name, members }) {
  const getMemberText = () => {
    if (members === 1) {
      return `${members} member`;
    }

    return `${members} members`;
  };

  return (
    <>
      <Avatar src={profileIconURL} size={128}>
        {name[0]}
      </Avatar>
      <p className="text-muted avatar-title">
        You&apos;ve been invited to join a group
      </p>
      <h1 className="card-title">{name}</h1>
      <p className="text-muted">{getMemberText(members)}</p>
    </>
  );
}

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

  // TODO: Remove the (|| 'debug') part, that's for testing
  // A value is given here so we can visit this page regardless
  const userId = localStorage.getItem('id') || 'debug';
  const userToken = localStorage.getItem('token') || 'debug';

  // TODO: Implement this/handle errors
  const acceptInvite = async () => {
    if (isLoading) {
      return;
    }

    setLoading(true);

    try {
      await API.joinGroup();

      // TODO: Dummy code - randomly throw an error to simulate random API errors
      if (Math.round(Math.random())) {
        throw new Error('Oops...');
      }
    } catch (err) {
      setHasError(true);
      return;
    }

    setAccepted(true);
  };

  const goToHomePage = () => {
    // Take the user back to the main page, but only if they were logged in
    history.push(userId && userToken ? '/main' : '/');
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

  useEffect(async () => {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get('id');

    if (!userId || !userToken) {
      history.replace('/');
      return;
    }

    if (inviteCode !== 'debug' || !groupId) {
      setIsLinkInvalid(true);
      return;
    }

    // TODO: Get the group info here, this is just for testing
    try {
      await API.getGroup(groupId);
    } catch (err) {
      setIsLinkInvalid(true);
      return;
    }

    setGroup(DEBUG_GROUP);
  }, []);

  if (!group && !isLinkInvalid) {
    return (
      <div className="group-invite-page">
        <div className="card-container" />
      </div>
    );
  }

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
          <Card className="group-card">
            {isLinkInvalid ? (
              <>
                <h1 className="card-title">Invalid Invite</h1>
                <Alert
                  type="error"
                  className="invalid-code-alert"
                  message="Group Not Found"
                  description="The group you’re looking for doesn’t exist."
                />
                <Button variant="link" onClick={goToHomePage}>
                  Take me back
                </Button>
              </>
            ) : (
              <>
                <GroupInfo
                  profileIconURL={group.profileIconURL}
                  name={group.name}
                  members={group.members}
                />
                {renderCardActions()}
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

GroupInfo.propTypes = {
  profileIconURL: PropTypes.string,
  name: PropTypes.string.isRequired,
  members: PropTypes.number.isRequired,
};

GroupInfo.defaultProps = {
  profileIconURL: '',
};

GroupInvitePage.propTypes = {
  inviteCode: PropTypes.string.isRequired,
};

export default GroupInvitePage;
