// These options are ONLY disabled to keep prettier from fighting eslint
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import axios from 'axios';
import APIError from './APIError';

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

/**
 * @typedef UserResponse
 * @property {String} username
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} email
 */

/**
 * @typedef ImageObject
 * @property {String} fileName
 * @property {String} creator
 * @property {String} dateUploaded
 * @property {String} URL
 */

/**
 * @typedef GroupResponse
 * @property {String} name
 * @property {String} id
 * @property {UserResponse} creator
 * @property {ImageObject} thumbnail
 * @property {Number} memberCount
 * @property {Boolean} publicGroup
 * @property {Array<UserResponse>} invitedUsers

/*
 * @typedef ImageUploadResponse
 * @property {String} caption
 * @property {String} fileName
 * @property {String} creator
 * @property {String} groupId
 * @property {String} dateUploaded
 * @property {String} URL
 * @property {String} id
 */

const API = {
  /**
   * Logs user into account.
   *
   * @param {String} username
   * @param {String} password
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  async login(username, password) {
    const payload = { username, password };
    return (await axios.post('/users/login', payload)).data;
  },

  /**
   * Registers a new user.
   *
   * @typedef {Object} RegistrationOptions
   * @property {string} firstName
   * @property {string} lasName
   * @property {string} email
   * @property {string} username
   * @property {string} password
   *
   * @param {RegistrationOptions} payload
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  async register(payload) {
    return axios.post('/users/', payload).then(response => response.data);
  },

  /**
   * Fetches user info.
   *
   * @param {string} token
   * @param {string} id
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  async getInfo(token, id) {
    return axios
      .get(`/users/${id}`, {
        headers: { Authorization: token },
      })
      .then(response => response.data);
  },

  /**
   * Takes an email address and makes a request to send
   * a verification link to that email.
   *
   * @param {string} email
   * @throws {APIError} On server error
   * @returns {Promise<void>}
   */
  async requestEmailVerificationLink(email) {
    return (await axios.post('/users/resendVerificationEmail', { email })).then(
      response => response.data,
    );
  },

  /**
   * Verifies a users email. The verification code should match
   * the code sent from the API.
   *
   * @param {string} userId
   * @param {string} verificationCode
   * @throws {APIError} On server error
   * @returns {Promise<void>}
   */
  async verifyEmail(userId, verificationCode) {
    return axios
      .post(`/users/${userId}/verify`, { verificationCode })
      .then(response => response.data);
  },

  /**
   * Joins a group with the given invite code.
   *
   * @param {string} userId
   * @param {string} inviteCode
   * @throws {APIError} On server error
   * @returns {Promise<void>}
   */
  async joinGroup(userId, inviteCode) {
    return axios
      .post(`/groups/${inviteCode}/join`, { user: userId })
      .then(response => response.data);
  },

  /**
   * Fetches the group with the given ID>
   *
   * @param {String} groupId The ID of the group to fetch.
   * @returns {Promise<GroupResponse>} The group with the given ID
   */
  async getGroup(groupId) {
    return axios.get(`/groups/${groupId}`).then(response => response.data);
  },

  /**
   * Creates a new group with the given options.
   *
   * @typedef {Object} GroupOptions
   * @property {string} name
   * @property {boolean} publicGroup
   * @property {string} creator - The ID of the user creating the group
   * @property {string[]} emails - A list of emails to send invitation links
   * (if the group is private)
   *
   * @param {GroupOptions} payload
   * @throws {APIError} On server error
   * @returns {Promise<void>}
   */
  async createGroup(payload) {
    return axios.post('/groups', payload).then(response => response.data);
  },

  /**
   * Gets the list of groups that the user is in.
   *
   * @param {string} userId
   * @throws {APIError} On server error.
   * @returns {Promise<Array<GroupResponse>>}
   */
  async getGroups(userId) {
    return axios.get(`/users/${userId}/groups`).then(response => response.data);
  },

  /**
   * Gets the list of images for the given group.
   *
   * @param {string} groupId
   * @throws {APIError} On server error.
   * @returns {Promise<{ images: ImageObject[] }>}
   */
  async getGroupImages(groupId) {
    return (await axios.get(`/groups/${groupId}/images`)).data;
  },

  /**
   * Uploads an image or GIF to the specified group.
   *
   * @typedef {Object} ImageUploadOptions
   * @property {File} image
   * @property {string} userId
   * @property {string} groupId
   * @property {string?} caption
   *
   * @param {ImageUploadOptions} payload
   * @param {ProgressEvent} onUploadProgress
   * @param {import('axios').CancelToken} cancelToken - Specifies a cancel
   *  token that can be used to cancel the request
   *
   * @throws {APIError} On server error.
   * @returns {Promise<ImageUploadResponse>}
   */
  async uploadGroupImage(
    payload,
    onUploadProgress = () => {},
    cancelToken = null,
  ) {
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

    return axios
      .put(`/groups/${groupId}/uploadImage`, formData, {
        onUploadProgress,
        cancelToken,
      })
      .then(response => response.data);
  },

  /**
   * Sends an invitation email to each provided email.
   *
   * @param {string} groupId
   * @param {string[]} emails
   *
   * @returns {Promise}
   * @throws {APIError} On server error.
   */
  async sendGroupInviteLink(groupId, emails) {
    return axios
      .post(`/groups/${groupId}/invite`, {
        groupId,
        emails,
      })
      .then(response => response.data);
  },

  /**
   * Sends password reset email to entered email.
   *
   * @param {String} email
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  async passwordRecovery(email) {
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
  async passwordReset(userId, verificationCode, password) {
    const payload = { userId, verificationCode, password };
    return (await axios.post('/users/resetPassword', payload)).data;
  },

  /**
   * Updates a user's information
   *
   * @typedef {Object} AccountParams
   * @property {string} firstName
   * @property {boolean} lastName
   * @property {string} email
   * @property {string} username
   * @property {string} token
   * @property {string} userId
   *
   * @param {AccountParams} payload
   * @throws {APIError} On server error
   * @returns {Promise}
   */
  async updateAccount(payload) {
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

    return axios
      .put(`/users/${userId}`, putOptions, {
        headers: {
          Authorization: token,
        },
      })
      .then(response => response.data);
  },

  /**
   * Updates a user's profile picture. Accepts either JPG, PNG, or GIF.
   *
   * @param {string} userId
   * @param {string} token
   * @param {File} image
   * @throws {APIError} On server error
   * @returns {Promise}
   */
  async updateProfilePicture(userId, token, image) {
    const formData = new FormData();

    formData.set('avatar', image);

    return axios
      .put(`/users/${userId}/profile`, formData, {
        headers: {
          Authorization: token,
        },
      })
      .then(response => response.data);
  },

  /**
   * Permanently deletes a user's account
   *
   * @param {string} userId
   * @param {string} password
   * @param {string} token
   * @throws {APIError} On server error
   * @returns {Promise}
   */
  async deleteAccount(userId, token, password) {
    return axios
      .delete(`/users/${userId}`, {
        data: {
          password,
        },
        headers: {
          Authorization: token,
        },
      })
      .then(response => response.data);
  },
};

export default API;
