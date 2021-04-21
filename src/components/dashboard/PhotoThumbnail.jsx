import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Image } from 'antd';
import fallback from '../../assets/errorimage.png';
import loadingSvg from '../../assets/no-photos.svg';

function PhotoThumbnail({ src, caption }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <motion.div
      className="thumbnail-wrapper"
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
      <Image
        className="photo-thumbnail"
        onLoad={() => setLoading(false)}
        src={isLoading ? loadingSvg : src}
        fallback={fallback}
      />
      {caption && (
        <div className="thumbnail-caption">
          <p className="caption">{caption}</p>
        </div>
      )}
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
