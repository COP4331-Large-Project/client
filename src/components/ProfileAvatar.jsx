import React from 'react';
import '../scss/profile-image.scss';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} AvatarData
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} imgURL
 * @property {String} imgAlt
 */

function ProfileAvatar({ avatarData }) {
  let profileContent;
  if (avatarData.imgURL) {
    profileContent = <img className="profile-image" src={avatarData.imgURL} alt={avatarData.imgAlt} />;
  } else {
    profileContent = <div className="profile-text">
      {avatarData.firstName[0] + avatarData.lastName[0]}
    </div>;
  }

  return (
    <div className="profile-container">
      {profileContent}
    </div>
  );
}

ProfileAvatar.propTypes = {
  avatarData: PropTypes.objectOf('AvatarData').isRequired,
};

export default ProfileAvatar;
