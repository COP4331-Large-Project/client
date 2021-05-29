import '../scss/group-invite-page.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { useHistory, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import API from '../api/API';
import { Group } from '../types';

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

type GroupInvitePageProps = {
  inviteCode: string
}

function GroupInvitePage({ inviteCode } : GroupInvitePageProps): JSX.Element {
  const [accepted, setAccepted] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoadingGroup, setLoadingGroup] = useState(false);
  const [isAcceptingInvite, setAcceptingInvite] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);

  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const userId = localStorage.getItem('id');
  const groupId = params.get('groupId');

  const getMemberText = (numUsers: number) => {
    if (numUsers === 1) {
      return `${numUsers.toLocaleString()} member`;
    }

    return `${numUsers.toLocaleString()} members`;
  };

  type Error = {
    title: string,
    description: string | JSX.Element
  }

  const acceptInvite = async () => {
    if (isAcceptingInvite) {
      return;
    }

    setAcceptingInvite(true);

    try {
      await API.joinGroup(userId ?? '', inviteCode);
    } catch (err) {
      const errorObj: Error = {
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
            <Link to="/" className="card-link">
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
              <Link to="/" className="card-link" replace>
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
          <Button variant="link" onClick={() => history.push('/')}>
            Take me back
          </Button>
        </>
      );
    }

    if (group !== null) {
      return (
        <>
          <Avatar src={group.thumbnail && group.thumbnail.URL} size={128}>
            {group.name[0]}
          </Avatar>
          <p className="text-muted avatar-title">
            You&apos;ve been invited to join a group.
          </p>
          <h1 className="card-title">{group.name}</h1>
          <p className="text-muted">{getMemberText(group.memberCount)}</p>
          {renderCardActions()}
        </>
      );
    }

    return null;
  };

  useEffect(() => {
    (async () => {
      if (!groupId) {
        setIsLinkInvalid(true);
        return;
      }
  
      setLoadingGroup(true);
  
      try {
        const groupInfo = await API.getGroup(groupId);
        const { publicGroup, invitedUsers } = groupInfo;
        const invitedUser = invitedUsers.find(user => user.id === userId);
        // const groupCreator = creator.find(
        //   // eslint-disable-next-line no-underscore-dangle
        //   user => user._id === userId || user.id === userId,
        // );
  
        // Private groups need explicit invitation so we'll
        // hide the group from the user if the group is private.
        // Even though the creator can't join their group, we still
        // want them to see the invite card
        if (!publicGroup && !invitedUser) {
          setLoadingGroup(false);
          setIsLinkInvalid(true);
          return;
        }
  
        setGroup(groupInfo);
      } catch (err) {
        setIsLinkInvalid(true);
      }
  
      setLoadingGroup(false);
    })()
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
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <Card className="group-card">{renderCardContent()!}</Card>
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
