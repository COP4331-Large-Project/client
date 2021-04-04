import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import '../scss/photo-grid.scss';
import PhotoThumbnail from './PhotoThumbnail.jsx';

function PhotoGrid({ photos }) {
  return (
    <motion.div>
        <div className="photo-grid">
            {photos.map(photo => (
                <PhotoThumbnail key={photo} src={photo} />
            ))}
        </div>
      </motion.div>
  );
}

PhotoGrid.propTypes = {
  photos: PropTypes.arrayOf(String).isRequired,
};

export default PhotoGrid;
