function userReducer(state, action) {
  switch (action.type) {
    case 'updateUser':
      return {
        ...action.payload,
      };
    default:
      throw new Error(`Invalid User reducer action ${action}`);
  }
}

export default userReducer;
