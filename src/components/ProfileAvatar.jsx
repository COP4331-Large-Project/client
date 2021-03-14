import React from 'react';
import '../scss/profile-image.scss';
import PropTypes from 'prop-types';

function ProfileAvatar({ avatarData }) {
  const profileContent = avatarData.imgURL
    ? (<img
      className="profile-image"
      src={avatarData.imgURL}
      alt={avatarData.imgAlt} />)
    : (<div className="profile-text">
         {avatarData.firstName[0] + avatarData.lastName[0]}
       </div>);

  return (
    <div className="profile-container">
      {profileContent}
    </div>
  );
}

ProfileAvatar.propTypes = {
  avatarData: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    imgURL: PropTypes.string,
    imgAlt: PropTypes.string,
  }).isRequired,
};

export default ProfileAvatar;
