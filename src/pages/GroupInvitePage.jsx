/* eslint-disable */
import '../scss/group-invite-page.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';

const DEBUG_GROUP = {
  name: 'Architecture',
  members: 7,
  profileIconURL:
    'https://images.unsplash.com/photo-1617516202907-ff75846e6667?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1828&q=80',
};

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

function GroupInvitePage({ groupCode }) {
  const history = useHistory();
  const [accepted, setAccepted] = useState(false);
  const [group, setGroup] = useState(DEBUG_GROUP);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const acceptInvite = () => {
    setAccepted(true);
    // setHasError(true);
    setTimeout(() => {
      // Replace the URL so the user can't go back to this page
      // after they accept the invitation
      history.replace('/main');
    }, 2500);
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

  useEffect(() => {
    if (!groupCode || !groupCode.trim()) {
      history.replace('/');
      return;
    }
  }, []);

  return (
    <div className="group-invite-page">
      <div className="card-container">
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
