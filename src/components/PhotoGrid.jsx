import React from 'react';
import PropTypes from 'prop-types';
import '../scss/photo-grid.scss';
import PhotoThumbnail from './PhotoThumbnail.jsx';

function PhotoGrid({ photos }) {
  return (
        <div className="photo-grid">
            {photos.map(photo => (
                <PhotoThumbnail key={photo} src={photo} />
            ))}
        </div>
  );
}

PhotoGrid.propTypes = {
  photos: PropTypes.arrayOf(String).isRequired,
};

export default PhotoGrid;
