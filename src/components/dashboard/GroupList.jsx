import '../../scss/group-list.scss';
import React, { useContext } from 'react';
import { Avatar, List } from 'antd';
import PropTypes from 'prop-types';
import LoadingContext from '../../contexts/LoadingContext.jsx';

function GroupList({ groups, activeIndex, onGroupClick }) {
  const { groupsLoading } = useContext(LoadingContext);
  const publicGroups = [];
  const privateGroups = [];

  groups.forEach((group, index) => {
    // Because the groups are in two different arrays, we need
    // to save the index since they both have different indices.
    const groupObj = {
      ...group,
      groupIndex: index,
    };

    if (group.publicGroup) {
      publicGroups.push(groupObj);
    } else {
      privateGroups.push(groupObj);
    }
  });

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

  // prettier-ignore
  const renderListItem = ({
    name,
    thumbnail,
    memberCount,
    groupIndex,
  }) => (
    <List.Item onClick={() => onGroupClick(groupIndex)} title={name}>
      <List.Item.Meta
        className={groupIndex === activeIndex ? 'selected' : ''}
        avatar={renderGroupImage(thumbnail, name)}
        title={name}
        description={getMemberText(memberCount || 1)}
      />
    </List.Item>
  );

  return (
    <div className="group-list">
      <List
        dataSource={publicGroups}
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
      {!groupsLoading && privateGroups.length > 0 && (
        <List
          className="group-list-private"
          dataSource={privateGroups}
          header={<p className="list-header">Private Groups</p>}
          renderItem={renderListItem}
        />
      )}
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
