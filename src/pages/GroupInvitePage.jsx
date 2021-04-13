/* eslint-disable */
import '../scss/group-invite-page.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { motion } from 'framer-motion';

const DEBUG_GROUP = {
  name: 'Architecture',
  members: 7,
  profileIconURL:
    'https://images.unsplash.com/photo-1617516202907-ff75846e6667?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1828&q=80',
};
const debugWait = time => new Promise(resolve => setTimeout(resolve, time));

const getMemberText = members => {
  if (members === 1) {
    return `${members} member`;
  }

  return `${members} members`;
};

function GroupInfo({ profileIconURL, name, members }) {
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
  delay: 0.3,
  duration: 1.5,
  ease: [0.16, 1, 0.3, 1],
};

function GroupInvitePage({ groupCode }) {
  const history = useHistory();
  const [accepted, setAccepted] = useState(false);
  const [group, setGroup] = useState(DEBUG_GROUP);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // TODO: Implement this/handle errors
  const acceptInvite = async () => {
    if (isLoading) {
      return;
    }

    setLoading(true);

    await debugWait(1500);
    setAccepted(true);

    await debugWait(1500);
    // Replace the URL so the user can't go back to this page
    // after they accept the invitation
    history.replace('/main');
  };

  const cardActions = (
    <>
      <Button onClick={acceptInvite}>Accept Invite</Button>
      <Button variant="link" onClick={() => history.push('/')}>
        Decline
      </Button>
    </>
  );

  const alert = hasError ? (
    <Alert
      type="error"
      className="invalid-code-alert"
      message="Invalid Invite Link"
      description="The group you’re looking for doesn’t exist. Make sure this invite link is valid.."
    />
  ) : (
    <Alert
      type="success"
      message="Success!"
      description="You'll be redirected to the main page shortly."
    />
  );

  useEffect(async () => {
    if (!groupCode || !groupCode.trim()) {
      history.replace('/');
      return;
    }

    // TODO: Get the group info here
    // Dummy code to emulate async
    await debugWait(1000);
    setGroup(DEBUG_GROUP);
  }, []);

  if (!group) {
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
          transition={animationOpts}
          variants={animationVariants}
        >
          <Card className="group-card">
            {hasError ? (
              <>
                <h1 className="card-title">Group Not Found</h1>
                <Alert
                  type="error"
                  className="invalid-code-alert"
                  message="Invalid Invite Link"
                  description="The group you’re looking for doesn’t exist. Make sure this invite link is valid.."
                />
              </>
            ) : (
              <>
                <GroupInfo
                  profileIconURL={group.profileIconURL}
                  name={group.name}
                  members={group.members}
                />
                {accepted ? alert : cardActions}
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
  groupCode: PropTypes.string.isRequired,
};

export default GroupInvitePage;
