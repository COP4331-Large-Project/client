/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Image } from 'antd';

function PhotoThumbnail({ src }) {
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
      <Image
        className="photo-thumbnail"
        src={src}
        fallback="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3hWNV2E6aTe_edfDRBjSKo4KvAWfzaXxHzw&usqp=CAU"
      />
    </motion.div>
  );
}

PhotoThumbnail.propTypes = {
  src: PropTypes.string.isRequired,
};

export default PhotoThumbnail;
