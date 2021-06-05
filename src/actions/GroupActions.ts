import { GroupAction } from '../contexts/types';
import { Group, Image } from '../types';

/**
 * Mapped actions for the groups state reducer.
 */
const GroupActions = {
  /**
   * Sets the current selected group index.
   */
  setIndex(index: number): GroupAction {
    return { type: 'setIndex', payload: index };
  },

  /**
   * Sets the images currently viewed in the group.
   *
   * @param images The images to be set to.
   */
  setImages(images: Image[]): GroupAction {
    return { type: 'setImages', payload: images };
  },

  /**
   * Adds the group to existing list of groups.
   *
   * @param group The group to be added.
   * @param index The index to update to.
   */
  addGroup(group: Group, index: number | undefined = undefined): GroupAction {
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
   * @param groups Groups to replace with.
   * @param index Index to replace at.
   */
  replaceGroups(groups: Group[], index: number): GroupAction {
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
   * @param image The image to add.
   */
  addImage(image: Image): GroupAction {
    return {
      type: 'addImage',
      payload: image,
    };
  },

  /**
   * Initializes the default values for the groups state.
   *
   * @param groups The initial groups.
   * @param images The initial image.
   * @param index The initial index.
   */
  init(groups: Group[], images: Image[], index: number): GroupAction {
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
   * @param groups The current list of groups.
   */
  updateGroupMemberCount(groups: Group[]): GroupAction {
    return { type: 'updateGroupMemberCount', payload: groups };
  },
};

export default GroupActions;
