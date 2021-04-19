import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Image } from 'antd';
import fallback from '../../assets/errorimage.png';

function PhotoThumbnail({ src, caption }) {
  return (
    <motion.div
      transition={{
        duration: 1,
        type: 'spring',
        bounce: 0.1,
      }}
      whileHover={{
        scale: 1.1,
        transition: {
          duration: 0.4,
          type: 'spring',
          bounce: 0.5,
        },
      }}
      whileTap={{
        scale: 1.1,
        transition: {
          duration: 0.4,
          type: 'spring',
          bounce: 0.5,
        },
      }}
    >
      <div className="thumbnail-container">
        <Image className="photo-thumbnail" src={src} fallback={fallback} />
        {caption && (
          <div className="thumbnail-caption">
            <p className="caption">{caption}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

PhotoThumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string,
};

PhotoThumbnail.defaultProps = {
  caption: '',
};

export default PhotoThumbnail;
