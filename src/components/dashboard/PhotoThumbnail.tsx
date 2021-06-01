import '../../scss/photo-thumbnail.scss';
import { useState } from 'react';
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
import { useUserState } from '../../hooks/user';
import { useGroups, useGroupsState } from '../../hooks/group';
import API from '../../api/API';
import GroupActions from '../../actions/GroupActions';

type PhotoThumbnailProps = {
  src: string;
  caption?: string;
  creatorId: string;
  imageId: string;
  isGroupOwner: boolean;
};

function PhotoThumbnail({
  // prettier-ignore
  src,
  caption,
  creatorId,
  imageId,
  isGroupOwner,
}: PhotoThumbnailProps): JSX.Element {
  const [isLoading, setLoading] = useState(true);
  const user = useUserState();
  const { groups, index, images } = useGroupsState();
  const { dispatch } = useGroups();

  // prettier-ignore
  const shouldShowDeleteButton = !isLoading && (isGroupOwner || user.id === creatorId);

  const deleteImage = async () => {
    try {
      const groupId = groups[index].id;

      await API.deleteImages(groupId, [imageId]);

      dispatch(GroupActions.setImages(images.filter(image => image.id !== imageId)));

      notification.success({
        key: 'image-deleted',
        duration: 2,
        description: 'This image was deleted.',
        message: 'This image was deleted.',
      });
    } catch (err) {
      notification.error({
        key: 'image-delete-error',
        message: 'An error occurred while deleting this image.',
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
