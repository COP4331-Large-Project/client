const GroupActions = {
  /**
   * Sets the current selected group index.
   *
   * @param {number} index
   */
  setIndex(index) {
    return { type: 'setIndex', payload: index };
  },

  /**
   * Sets the images currently viewed in the group.
   *
   * @param {*} images The images to be set to.
   */
  setImages(images) {
    return { type: 'setImages', payload: images };
  },

  /**
   * Adds the group to existing list of groups.
   *
   * @param {*} group The group to be added.
   * @param {number | undefined} index The index to update to.
   */
  addGroup(group, index = undefined) {
    return {
      type: 'addGroup',
      payload: {
        group: {
          ...group,
          memberCount: 1,
        },
        index,
      },
    };
  },

  /**
   * Replaces the groups at the given index.
   *
   * @param {*} groups Groups to replace with.
   * @param {number} index Index to replace at.
   */
  replaceGroups(groups, index) {
    return {
      type: 'replaceGroups',
      payload: {
        groups,
        index,
      },
    };
  },

  /**
   * Adds an image to the current group.
   *
   * @param {*} image The image to add.
   */
  addImage(image) {
    return {
      type: 'addImage',
      payload: image,
    };
  },

  /**
   * Initializes the default values for the groups state.
   *
   * @param {*} groups The initial groups.
   * @param {*} images The initial image.
   * @param {number} index The initial index.
   */
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

  /**
   * Updates the group member count.
   *
   * @param {*} groups The current list of groups.
   */
  updateGroupMemberCount(groups) {
    return { type: 'updateGroupMemberCount', payload: groups };
  },
};

export default GroupActions;
