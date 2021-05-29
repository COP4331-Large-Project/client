const GroupActions = {
  setIndex(index) {
    return { type: 'setIndex', payload: index };
  },

  setImages(images) {
    return { type: 'setImages', payload: images };
  },

  addGroup(group, index = undefined) {
    return {
      type: 'addGroup',
      payload: {
        ...group,
        memberCount: 1,
      },
      index,
    };
  },

  replaceGroups(groups, index) {
    return {
      type: 'replaceGroups',
      payload: {
        groups,
        index,
      },
    };
  },

  addImage(image) {
    return {
      type: 'addImage',
      payload: image,
    };
  },

  init(groups, images, index) {
    return {
      type: 'init',
      payload: {
        groups,
        images,
        index,
      },
    };
  },

  updateGroupMemberCount(groups) {
    return { type: 'updateGroupMemberCount', payload: groups };
  },
};

export default GroupActions;
