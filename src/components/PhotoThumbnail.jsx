import React from 'react';
import PropTypes from 'prop-types';

function PhotoThumbnail({ src }) {
  return (
        <img className="photo-thumbnail" src={src} />
  );
}

PhotoThumbnail.propTypes = {
  src: PropTypes.string.isRequired,
};

export default PhotoThumbnail;
