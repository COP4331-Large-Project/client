import '../../scss/photo-thumbnail.scss';
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
// prettier-ignore
import {
  Image,
  Spin,
  Button,
  Popconfirm,
  notification,
} from 'antd';
import { AiOutlineDelete } from 'react-icons/ai';
import fallback from '../../assets/errorimage.png';
import UserStateContext from '../../contexts/UserStateContext.jsx';
import GroupStateContext from '../../contexts/GroupStateContext.jsx';
import GroupsContextDispatch from '../../contexts/GroupsContextDispatch.jsx';
import API from '../../api/API';

function PhotoThumbnail({
  // prettier-ignore
  src,
  caption,
  creatorId,
  imageId,
  isGroupOwner,
}) {
  const [isLoading, setLoading] = useState(true);
  const user = useContext(UserStateContext);
  const { groups, index, images } = useContext(GroupStateContext);
  const dispatch = useContext(GroupsContextDispatch);

  // prettier-ignore
  const shouldShowDeleteButton = !isLoading && (isGroupOwner || user.id === creatorId);

  const deleteImage = async () => {
    try {
      const groupId = groups[index].id;

      await API.deleteImages(groupId, [imageId]);

      dispatch({
        type: 'setImages',
        payload: images.filter(image => image.id !== imageId),
      });

      notification.success({
        key: 'image-deleted',
        duration: 2,
        description: 'This image was deleted.',
      });
    } catch (err) {
      notification.error({
        key: 'image-delete-error',
        description: 'An error occurred while deleting this image.',
      });
    }
  };

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
        src={src}
        fallback={fallback}
        loading="lazy"
      />
      {shouldShowDeleteButton && (
        <Popconfirm
          title="Are you sure you want to delete this image?"
          okText="Delete"
          okType="danger"
          onConfirm={deleteImage}
        >
          <Button
            className="delete-btn"
            icon={<AiOutlineDelete color="white" />}
          />
        </Popconfirm>
      )}
      {isLoading && (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      )}
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
  creatorId: PropTypes.string.isRequired,
  imageId: PropTypes.string.isRequired,
  caption: PropTypes.string,
  isGroupOwner: PropTypes.bool,
};

PhotoThumbnail.defaultProps = {
  caption: '',
  isGroupOwner: false,
};

export default PhotoThumbnail;
