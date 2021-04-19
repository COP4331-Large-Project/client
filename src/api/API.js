import APIError from './APIError';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.imageus.io' : 'http://localhost:5000';
const relURL = path => BASE_URL + path;

/**
 * Handles the response from the server.
 *
 * @param {Response} response
 * @throws {APIError} On server error.
 * @returns {Promise<Object>}
 */
const handleResponse = async response => {
  if (!response.ok) {
    const errBody = await response.json();
    throw new APIError(errBody);
  }

  // There was an empty response from the server (no content)
  // so we need to return an empty object
  if (response.status === 204) {
    return {};
  }

  return response.json();
};

const postOptions = body => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
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

const API = {
  /**
   * Logs user into account.
   *
   * @param {String} username
   * @param {String} password
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  login: async (username, password) => {
    const payload = { username, password };
    return fetch(relURL('/users/login'), postOptions(payload))
      .then(handleResponse);
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
  register: async (payload) => fetch(relURL('/users/'), postOptions(payload))
    .then(handleResponse),

  /**
   * Fetches user info.
   *
   * @param {string} token
   * @param {string} id
   * @throws {APIError} On server error.
   * @returns {Promise<UserResponse>}
   */
  getInfo: async (token, id) => fetch(
    relURL(`/users/${id}`),
    {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    },
  )
    .then(handleResponse),

  /**
   * Takes an email address and makes a request to send
   * a verification link to that email.
   *
   * @param {string} email
   * @throws {APIError} On server error
   * @returns {Promise<UserResponse>}
   */
  requestEmailVerificationLink: async email => fetch(
    relURL('/users/resendVerificationEmail'),
    postOptions({ email }),
  ).then(handleResponse),

  /**
   * Verifies a users email. The verification code should match
   * the code sent from the API.
   *
   * @param {string} userId
   * @param {string} verificationCode
   * @throws {APIError} On server error
   * @returns {Promise<UserResponse>}
   */
  verifyEmail: async (userId, verificationCode) => fetch(
    relURL(`/users/${userId}/verify`),
    postOptions({ verificationCode }),
  ).then(handleResponse),

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
  createGroup: async payload => fetch(relURL('/groups'), postOptions(payload))
    .then(handleResponse),

  /**
   * Gets the list of groups that the user is in.
   *
   * @param {string} userId
   * @throws {APIError} On server error.
   * @returns {Promise}
   */
  getGroups: async userId => fetch(relURL(`/users/${userId}/groups`))
    .then(handleResponse),

  /**
   * Gets the list of images for the given group.
   *
   * @param {string} groupId
   * @throws {APIError} On server error.
   * @returns {Promise<{ images: ImageObject[] }>}
   */
  getGroupImages: async groupId => fetch(relURL(`/groups/${groupId}/images`))
    .then(handleResponse),

  /**
   * Takes an email address and makes a request to send
   * a verification link to that email.
   *
   * @param {string} email
   * @throws {APIError} On server error
   * @returns {Promise<UserResponse>}
   */
  passwordRecovery: async email => fetch(
    relURL('/users/passwordRecovery'),
    postOptions({ email }),
  ).then(handleResponse),
};

export default API;
