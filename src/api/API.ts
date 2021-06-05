// These options are ONLY disabled to keep prettier from fighting eslint
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import axios, { CancelToken } from 'axios';
import { Group } from '../types';
import APIError from './APIError';
import { UserResponse, GroupOptions, GroupResponse, ImageObject, ImageUploadOptions, ImageUploadResponse, AccountParams, RegistrationOptions } from './types';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.imageus.io'
    : 'http://localhost:5000';

// Setup Axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Setup error interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (axios.isCancel(error)) {
      // 499 represents a request that was cancelled by the user
      throw new APIError({ status: 499 });
    }

    throw new APIError(error.response.data);
  },
);


const API = {
  /**
   * Logs user into account.
   *
   * @throws {APIError} On server error.
   */
  async login(username: string, password: string): Promise<UserResponse> {
    const payload = { username, password };
    return (await axios.post('/users/login', payload)).data;
  },

  /**
   * Registers a new user.
   *
   * @param {RegistrationOptions} payload
   * @throws {APIError} On server error.
   */
  async register(payload: RegistrationOptions): Promise<UserResponse> {
    const response = await axios.post('/users/', payload);
    return response.data;
  },

  /**
   * Fetches user info.
   *
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  async getInfo(token: string, id: string): Promise<UserResponse> {
    const response = await axios
      .get(`/users/${id}`, {
        headers: { Authorization: token },
      });
    return response.data;
  },

  /**
   * Takes an email address and makes a request to send
   * a verification link to that email.
   *
   * @param email
   * @throws {APIError} On server error
   */
  requestEmailVerificationLink(email: string): Promise<void> {
    return axios.post('/users/resendVerificationEmail', { email });
  },

  /**
   * Verifies a users email. The verification code should match
   * the code sent from the API.
   *
   * @throws {APIError} On server error
   */
  async verifyEmail(userId: string, verificationCode: string): Promise<void> {
    const response = await axios
      .post(`/users/${userId}/verify`, { verificationCode });
    return response.data;
  },

  /**
   * Joins a group with the given invite code.
   *
   * @param userId
   * @param inviteCode
   * @throws {APIError} On server error
   */
  async joinGroup(userId: string, inviteCode: string): Promise<Group> {
    const response = await axios
      .post(`/groups/${inviteCode}/join`, { user: userId });
    return response.data;
  },

  /**
   * Fetches the group with the given ID>
   *
   * @param {String} groupId The ID of the group to fetch.
   * @returns {Promise<GroupResponse>} The group with the given ID
   */
  async getGroup(groupId: string): Promise<Group> {
    const response = await axios.get<Group>(`/groups/${groupId}`);
    return response.data;
  },

  

  /**
   * Creates a new group with the given options.
   *
   * @throws {APIError} On server error
   */
  async createGroup(payload: GroupOptions): Promise<Group> {
    const response = await axios.post('/groups', payload);
    return response.data;
  },

  /**
   * Gets the list of groups that the user is in.
   *
   * @throws {APIError} On server error.
   */
  async getGroups(userId: string): Promise<GroupResponse[]> {
    const response = await axios.get(`/users/${userId}/groups`);
    return response.data;
  },

  /**
   * Gets the list of images for the given group.
   *
   * @param {string} groupId
   * @throws {APIError} On server error.
   * @returns {Promise<{ images: ImageObject[] }>}
   */
  async getGroupImages(groupId: string): Promise<{ images: ImageObject[] }> {
    return (await axios.get(`/groups/${groupId}/images`)).data;
  },

  /**
   * Uploads an image or GIF to the specified group.
   *
   * @param cancelToken - Specifies a cancel
   *  token that can be used to cancel the request
   *
   * @throws {APIError} On server error.
   * @returns {Promise<ImageUploadResponse>}
   */
  async uploadGroupImage(
    payload: ImageUploadOptions,
    onUploadProgress: (event: ProgressEvent<EventTarget>) => void,
    cancelToken: CancelToken,
  ): Promise<ImageUploadResponse> {
    // prettier-ignore
    const {
      image,
      userId,
      groupId,
      caption = '',
    } = payload;
    const formData = new FormData();

    formData.append('groupPicture', image);
    formData.append('userId', userId);
    formData.append('caption', caption);

    const response = await axios
      .put(`/groups/${groupId}/uploadImage`, formData, {
        onUploadProgress,
        cancelToken,
      });
    return response.data;
  },

  /**
   * Sends an invitation email to each provided email.
   *
   * @throws {APIError} On server error.
   */
  async sendGroupInviteLink(groupId: string, emails: string[]): Promise<void> {
    const response = await axios
      .post(`/groups/${groupId}/invite`, {
        groupId,
        emails,
      });
    return response.data;
  },

  /**
   * Removes a user from a group for each given user ID.
   *
   * @returns {Promise}
   * @throws {APIError} On server error.
   */
  async removeUser(groupId: string, userId: string): Promise<void> {
    const response = await axios
      .delete(`/groups/${groupId}/removeUser`, { data: { user: userId } });
    return response.data;
  },

  /**
   * Sends password reset email to entered email.
   *
   * @param {String} email
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  async passwordRecovery(email: string): Promise<UserResponse> {
    const payload = { email };
    return (await axios.post('/users/passwordRecovery', payload)).data;
  },

  /**
   * Reset password given a user id, password, and verification code.
   *
   * @param {String} userId
   * @param {String} verificationCode
   * @param {String} password
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  async passwordReset(userId: string, verificationCode: string, password: string): Promise<UserResponse> {
    const payload = { userId, verificationCode, password };
    return (await axios.post('/users/resetPassword', payload)).data;
  },

  /**
   * Updates a user's information
   *
   * @throws {APIError} On server error
   */
  async updateAccount(payload: Partial<AccountParams>): Promise<UserResponse> {
    // prettier-ignore
    const {
      firstName,
      lastName,
      email,
      username,
      userId,
      token,
    } = payload;

    const putOptions = {
      firstName,
      lastName,
      email,
      username,
    };

    const response = await axios
      .put(`/users/${userId}`, putOptions, {
        headers: {
          Authorization: token,
        },
      });
    return response.data;
  },

  /**
   * Updates a user's profile picture. Accepts either JPG, PNG, or GIF.
   *
   * @throws {APIError} On server error
   */
  async updateProfilePicture(userId: string, token: string, image: File): Promise<void> {
    const formData = new FormData();

    formData.set('avatar', image);

    const response = await axios
      .put(`/users/${userId}/profile`, formData, {
        headers: {
          Authorization: token,
        },
      });
    return response.data;
  },

  /**
   * Permanently deletes a user's account
   *
   * @throws {APIError} On server error
   */
  async deleteAccount(userId: string, token: string, password: string): Promise<void> {
    const response = await axios
      .delete(`/users/${userId}`, {
        data: {
          password,
        },
        headers: {
          Authorization: token,
        },
      });
    return response.data;
  },

  /**
   * Deletes a group with the given id.
   *
   * @throws {APIError} On server error.
   */
  async deleteGroup(groupId: string, userId: string): Promise<void> {
    const response = await axios
      .delete(`/groups/${groupId}`, {
        data: {
          user: userId,
        },
      });
    return response.data;
  },

  /**
   * Deletes the given images from the dataabase
   * 
   * @throws {APIError} On server error.
   */
  async deleteImages(groupId: string, images: string[]): Promise<void> {
    const response = await axios
      .post(`/groups/${groupId}/deleteImages`, { images });
    return response.data;
  },
};

export { API as default, BASE_URL };
