import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Image } from 'antd';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import PhotoThumbnail from './PhotoThumbnail.jsx';
import FloatingButton from './FloatingButton.jsx';
import ImageUploadModal from '../ImageUploadModal.jsx';

import '../../scss/photo-grid.scss';

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
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);

  const openUploadModal = () => setUploadModalVisible(true);
  const closeUploadModal = () => setUploadModalVisible(false);

  return (
    <motion.div variants={container} initial="hidden" animate="show" layout>
      <div className="photo-grid-container">
        <Image.PreviewGroup>
          <div className="photo-grid">
            {photos.map(photo => (
              <motion.div key={photo} variants={item}>
                <PhotoThumbnail key={photo} src={photo} />
              </motion.div>
            ))}
            <FloatingButton onClick={openUploadModal}>
              <AiOutlineCloudUpload size={32} color="#525252" />
            </FloatingButton>
          </div>
        </Image.PreviewGroup>
      </div>
      <ImageUploadModal
        visible={isUploadModalVisible}
        onClose={closeUploadModal}
      />
    </motion.div>
  );
}

PhotoGrid.propTypes = {
  photos: PropTypes.arrayOf(String).isRequired,
};

export default PhotoGrid;
