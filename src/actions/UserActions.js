/**
 * Mapped actions for the User state reducer.
 */
const UserActions = {
  /**
   * Updates the currently used user.
   *
   * @param {*} user The user to update to.
   */
  updateUser(user) {
    return { type: 'updateUser', payload: user };
  },
};

export default UserActions;
