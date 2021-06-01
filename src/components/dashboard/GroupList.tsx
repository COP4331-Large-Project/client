/* eslint-disable @typescript-eslint/ban-ts-comment */

import '../../scss/group-list.scss';
import { Avatar, List } from 'antd';
import { useLoading } from '../../hooks/loading';
import { Group, Image } from '../../types';

// I don't know what the deal is with ants datasource types, I'll get to it later (TM)

type GroupListProps = {
  groups: Group[];
  activeIndex: number;
  onGroupClick(index: number): void;
};

type ListItem = {
  name: string;
  thumbnail: Image;
  memberCount: number;
  groupIndex: number;
};

function GroupList({ groups = [], activeIndex = 0, onGroupClick }: GroupListProps): JSX.Element {
  const { groupsLoading } = useLoading();
  const publicGroups: Group[] = [];
  const privateGroups: Group[] = [];

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

  const getMemberText = (members: number) => {
    if (members === 1) {
      return `${members.toLocaleString()} member`;
    }

    return `${members.toLocaleString()} members`;
  };

  const renderGroupImage = (thumbnail: Image, title: string) => (
    <Avatar src={thumbnail && thumbnail.URL} size={54}>
      {title[0]}
    </Avatar>
  );

  // prettier-ignore
  const renderListItem = ({
    name,
    thumbnail,
    memberCount,
    groupIndex,
  }: ListItem) => (
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
        // @ts-ignore
        dataSource={publicGroups}
        header={
          <p className="list-header">
            {groupsLoading ? 'Loading groups...' : 'Public Groups'}
          </p>
        }
        loading={groupsLoading}
        // Don't show the empty text if the user is a member of at least on
        // public group or one private group.
        locale={{
          emptyText:
            publicGroups.length === 0 && privateGroups.length === 0
              ? `
            Looks like you’re not a member of any groups yet. Click the
            "Create Group" button to create a new group or click the
            "Join Group" button to join a group.
          `
              : ' ',
        }}
        renderItem={renderListItem}
      />
      {!groupsLoading && privateGroups.length > 0 && (
        <List
          className="group-list-private"
          // @ts-ignore
          dataSource={privateGroups}
          header={<p className="list-header">Private Groups</p>}
          renderItem={renderListItem}
        />
      )}
    </div>
  );
}

export default GroupList;
