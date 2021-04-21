import '../../scss/group-list.scss';
import React, { useContext } from 'react';
import { Avatar, List } from 'antd';
import PropTypes from 'prop-types';
import LoadingContext from '../../contexts/LoadingContext.jsx';

function GroupList({ groups, activeIndex, onGroupClick }) {
  const { groupsLoading } = useContext(LoadingContext);

  const getMemberText = members => {
    if (members === 1) {
      return `${members.toLocaleString()} member`;
    }

    return `${members.toLocaleString()} members`;
  };

  const renderGroupImage = (thumbnail, title) => (
    <Avatar src={thumbnail && thumbnail.URL} size={54} alt={title}>
      {title[0]}
    </Avatar>
  );

  const renderListItem = ({ name, thumbnail, memberCount }, index) => (
    <List.Item onClick={() => onGroupClick(index)} title={name}>
      <List.Item.Meta
        className={index === activeIndex ? 'selected' : ''}
        avatar={renderGroupImage(thumbnail, name)}
        title={name}
        description={getMemberText(memberCount || 1)}
      />
    </List.Item>
  );

  return (
    <div className="group-list">
      <List
        dataSource={groups}
        header={
          <p className="list-header">
            {groupsLoading ? 'Loading groups...' : 'Your Groups'}
          </p>
        }
        loading={groupsLoading}
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
      memberCount: PropTypes.number,
      thumbnail: PropTypes.shape({
        URL: PropTypes.string,
      }),
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
