import '../scss/profile-image.scss';

type ProfileAvatarProps = {
  avatarData: {
    firstName: string,
    lastName: string,
    imgURL?: string,
    imgAlt?: string,
  }
}

function ProfileAvatar({ avatarData }: ProfileAvatarProps): JSX.Element {
  const profileContent = avatarData.imgURL
    ? (
      <img
        className="profile-image"
        src={avatarData.imgURL}
        alt={avatarData.imgAlt}
      />
    )
    : (
      <div className="profile-text">
        {avatarData.firstName[0] + avatarData.lastName[0]}
      </div>
    );

  return (
    <div className="profile-container">
      {profileContent}
    </div>
  );
}

export default ProfileAvatar;
