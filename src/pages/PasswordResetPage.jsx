import React from 'react';
import PropTypes from 'prop-types';
import '../scss/password-reset-page.scss';

function PasswordResetPage({ userId }) {
  const params = new URLSearchParams(window.location.search);
  const verificationCode = params.get('verificationCode');
  return (
    <div>
      {`userId:${userId} verification:${verificationCode}`}
    </div>
  );
}

PasswordResetPage.propTypes = {
  userId: PropTypes.string.isRequired,
};

PasswordResetPage.defaultProps = {
  userId: '',
};

export default PasswordResetPage;
