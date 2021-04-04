/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function PhotoThumbnail({ src }) {
  return (
    <motion.div
    initial={{ y: 1000 }}
    animate={{ y: 0 }}
    transition={{
      duration: 1, type: 'spring', bounce: 0.1,
    }}
    whileHover={{
      scale: 1.1,
      transition: {
        duration: 0.4, type: 'spring', bounce: 0.5,
      },
    }}
    whileTap={{
      scale: 1.1,
      transition: {
        duration: 0.4, type: 'spring', bounce: 0.5,
      },
    }}>
      <img className="photo-thumbnail" src={src} />
    </motion.div>
  );
}

PhotoThumbnail.propTypes = {
  src: PropTypes.string.isRequired,
};

export default PhotoThumbnail;
