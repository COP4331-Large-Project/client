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
axios.interceptors.response.use(response => response, error => {
  throw new APIError(error.response.data);
});

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
    return axios.get(`/users/${id}`, {
      headers: { Authorization: token },
    }).then(response => response.data);
  },

  /**
   * Takes an email address and makes a request to send
   * a verification link to that email.
   *
   * @param {string} email
   * @throws {APIError} On server error
   * @returns {Promise}
   */
  async requestEmailVerificationLink(email) {
    return (await axios.post('/users/resendVerificationEmail', { email }))
      .then(response => response.data);
  },

  /**
   * Verifies a users email. The verification code should match
   * the code sent from the API.
   *
   * @param {string} userId
   * @param {string} verificationCode
   * @throws {APIError} On server error
   * @returns {Promise}
   */
  async verifyEmail(userId, verificationCode) {
    return axios.post(`/users/${userId}/verify`, { verificationCode })
      .then(response => response.data);
  },

  /**
   * Joins a group with the given invite code.
   *
   * @param {string} userId
   * @param {string} inviteCode
   * @throws {APIError} On server error
   * @returns {Promise}
   */
  async joinGroup(userId, inviteCode) {
    return axios.post(`/groups/${inviteCode}/join`, { user: userId })
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
   * @returns {Promise}
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
};

export default API;
