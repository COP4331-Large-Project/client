import '../../scss/photo-grid.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { Image, Spin } from 'antd';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import PhotoThumbnail from './PhotoThumbnail.jsx';
import FloatingButton from './FloatingButton.jsx';
import ImageUploadModal from '../ImageUploadModal.jsx';
import { useGroupsState } from '../../contexts/GroupsContextDispatch.jsx';
import { useLoading } from '../../contexts/LoadingContext.jsx';
import emptySvg from '../../assets/no-photos.svg';

const item = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1 },
};

function PhotoGrid({ photos, isGroupOwner }) {
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const openUploadModal = () => setUploadModalVisible(true);
  const closeUploadModal = () => setUploadModalVisible(false);
  const { groups } = useGroupsState();
  const { imagesLoading } = useLoading();

  const emptyContainer = (
    <div className="empty-overlay">
      <img
        src={emptySvg}
        className="empty-img"
        alt={groups.length === 0 ? 'empty group' : 'no photos'}
      />
      <h2 className="title">It&apos;s empty in here!</h2>
      <p className="description">
        {groups.length === 0
          ? 'Create or join a group to get this party started.'
          : 'Upload an image or invite some friends to the party.'}
      </p>
    </div>
  );

  const photoGrid = (
    <Image.PreviewGroup>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          initial={{
            opacity: 0,
            y: '25%',
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: '25%',
          }}
          transition={{
            ease: 'easeOut',
            duration: 0.7,
            type: 'spring',
            bounce: 0.25,
          }}
        >
          <div className="photo-grid">
            {photos.map(photo => (
              <motion.div key={photo.URL} variants={item}>
                <PhotoThumbnail
                  isGroupOwner={isGroupOwner}
                  key={photo.URL}
                  src={photo.URL}
                  caption={photo.caption}
                  creatorId={photo.creator}
                  imageId={photo.id}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </Image.PreviewGroup>
  );

  if (imagesLoading) {
    return (
      <div className="photo-grid-container loading">
        <Spin size="large" tip="Loading images..." />
      </div>
    );
  }

  return (
    <div className="photo-grid-container">
      {photos.length === 0 ? emptyContainer : photoGrid}
      {groups.length > 0 && (
        <FloatingButton onClick={openUploadModal}>
          <AiOutlineCloudUpload size={32} color="#525252" />
        </FloatingButton>
      )}
      <ImageUploadModal
        visible={isUploadModalVisible}
        onClose={closeUploadModal}
      />
    </div>
  );
}

PhotoGrid.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      URL: PropTypes.string.isRequired,
      caption: PropTypes.string,
      creator: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isGroupOwner: PropTypes.bool,
};

PhotoGrid.defaultProps = {
  isGroupOwner: false,
};

export default PhotoGrid;
