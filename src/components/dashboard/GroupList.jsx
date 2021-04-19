import '../../scss/group-list.scss';
import React from 'react';
import { Avatar, List } from 'antd';
import PropTypes from 'prop-types';

function GroupList({ groups, activeIndex, onGroupClick }) {
  const getMemberText = members => {
    if (members === 1) {
      return `${members.toLocaleString()} member`;
    }

    return `${members.toLocaleString()} members`;
  };

  const renderGroupImage = (thumbnail, title) => (
    <Avatar src={thumbnail} size={54} alt={title}>
      {title[0]}
    </Avatar>
  );

  const renderListItem = ({ name, thumbnail }, index) => (
    <List.Item onClick={() => onGroupClick(index)} title={name}>
      <List.Item.Meta
        className={index === activeIndex ? 'selected' : ''}
        avatar={renderGroupImage(thumbnail, name)}
        title={name}
        // TODO: Replace with actual group member count
        description={getMemberText(100)}
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
      title: PropTypes.string,
      imageURL: PropTypes.string,
      members: PropTypes.number,
    }),
  ),
  activeIndex: PropTypes.number,
  onGroupClick: PropTypes.func,
};

GroupList.defaultProps = {
  onGroupClick: () => {},
  groups: [],
  activeIndex: 0,
};

export default GroupList;
