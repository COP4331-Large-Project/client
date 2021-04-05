import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { HiUpload } from 'react-icons/hi';
import PhotoThumbnail from './PhotoThumbnail.jsx';
import FloatingButton from './FloatingButton.jsx';

import '../scss/photo-grid.scss';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 1.1 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function PhotoGrid({ photos }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      layout
    >
      <div className="photo-grid-container">
        <div className="photo-grid">
            {photos.map(photo => (
              <motion.div key={photo} variants={item}>
                <PhotoThumbnail key={photo} src={photo} />
              </motion.div>
            ))}
            <FloatingButton>
              <HiUpload size={35} />
            </FloatingButton>
        </div>
      </div>
      </motion.div>
  );
}

PhotoGrid.propTypes = {
  photos: PropTypes.arrayOf(String).isRequired,
};

export default PhotoGrid;
