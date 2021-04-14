import '../../scss/group-list.scss';
import React from 'react';
import { Avatar, List } from 'antd';
import PropTypes from 'prop-types';

function GroupList({ groups, onGroupClick }) {
  const getMemberText = members => {
    if (members === 1) {
      return `${members} member`;
    }

    return `${members} members`;
  };

  const renderGroupImage = (imageURL, title) => (
    <Avatar src={imageURL} size={54} alt={title}>
      {title[0]}
    </Avatar>
  );

  const renderListItem = ({ title, imageURL, members }, index) => (
    <List.Item onClick={() => onGroupClick(index)} title={title}>
      <List.Item.Meta
        avatar={renderGroupImage(imageURL, title)}
        title={title}
        description={getMemberText(members)}
      />
    </List.Item>
  );

  return (
    <div className="group-list">
      <List
        dataSource={groups}
        header={<p className="list-header">Your Groups</p>}
        locale={{
          emptyText: `
            Looks like you’re not a member of any groups yet. Click the
            "Create Group" button to create a new group or click the
            "Join Group" button to join a group.
          `,
        }}
        renderItem={renderListItem}
      />
    </div>
  );
}

GroupList.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageURL: PropTypes.string,
      members: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onGroupClick: PropTypes.func,
};

GroupList.defaultProps = {
  onGroupClick: () => {},
};

export default GroupList;
