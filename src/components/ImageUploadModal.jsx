import '../scss/image-upload-modal.scss';
import React, { useContext, useState } from 'react';
// prettier-ignore
import {
  Modal,
  Upload,
  Alert,
  Input,
  Tooltip,
} from 'antd';
import PropTypes from 'prop-types';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import GroupStateContext from '../contexts/GroupStateContext.jsx';
import UserContext from '../contexts/UserContext.jsx';
import API from '../api/API';

function ImageUploadModal({ visible, onClose }) {
  const [imageCaption, setImageCaption] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setUploading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { groups, index } = useContext(GroupStateContext);
  const user = useContext(UserContext);

  const previewImage = new Image();

  // Adds a custom input below ant's list item component
  const renderListItem = originNode => (
    <>
      <Tooltip title="Click to preview" mouseEnterDelay={0.7}>
        {originNode}
      </Tooltip>
      <div className="input-wrapper">
        <p className="input-title">
          Image Caption <span className="subtitle">(Optional)</span>
        </p>
        <Input
          className="caption-input"
          onChange={event => setImageCaption(event.target.value)}
          disabled={isUploading}
        />
        <p className="group-hint">
          This will upload your image to {groups[index].name}
        </p>
      </div>
    </>
  );

  const onBeforeUpload = inputFile => {
    // Returning false prevents ant from automatically uploading the
    // image right after the user selects an image
    setFile(inputFile);
    setHasError(false);
    return false;
  };

  const onFileRemoved = () => {
    setFile(null);
    setHasError(false);
  };

  const onRequestPreview = ({ thumbUrl }) => {
    // The browser won't properly display the image
    // in a new tab so we need to create an image with the data URI.
    // This allows us to customize how we render the image.
    if (thumbUrl) {
      previewImage.src = URL.createObjectURL(file);

      previewImage.style.width = '100%';
      previewImage.style.height = '100%';
      previewImage.style.objectFit = 'contain';

      // Release the object to free browser memory
      previewImage.onload = () => URL.revokeObjectURL(previewImage.src);

      const newWindow = window.open(thumbUrl, '_blank');
      newWindow.document.write(/* html */`
        <title>Preview</title>
        <style>
          body {
            margin: 0;
          }
        </style>
        <body>${previewImage.outerHTML}</body>
      `);
    }
  };

  // Make sure the state resets when the modal is closed
  const onRequestClose = () => {
    setUploading(false);
    onClose();
  };

  const uploadImage = async event => {
    event.preventDefault();

    if (isUploading || !file) {
      return;
    }

    setHasError(false);
    setUploading(true);

    try {
      await API.uploadGroupImage({
        image: file,
        caption: imageCaption,
        userId: user.id,
        groupId: groups[index].id,
      });

      // Reset the state of the modal only when an
      // image upload was successful.
      setFile(null);
      setImageCaption('');
      onRequestClose();
    } catch (err) {
      setHasError(true);
    }

    setUploading(false);
  };

  const getOkText = () => {
    if (isUploading) {
      return 'Uploading...';
    }

    if (hasError) {
      return 'Retry';
    }

    return 'Upload';
  };

  return (
    <Modal
      centered
      title="Upload Image"
      visible={visible}
      className="image-upload-modal"
      okButtonProps={{
        disabled: file === null,
        loading: isUploading,
      }}
      cancelButtonProps={{ danger: isUploading }}
      cancelText={isUploading ? 'Cancel' : 'Close'}
      onOk={uploadImage}
      onCancel={onRequestClose}
      okText={getOkText()}
      // Prevents the modal from closing when clicking on the overlay
      maskClosable={false}
    >
      {hasError && (
        <Alert
          closable
          message="Upload Error"
          description="An error occurred while uploading this image. Please try again."
          type="error"
          onClose={() => setHasError(false)}
        />
      )}
      <form onSubmit={uploadImage}>
        <Upload.Dragger
          disabled={isUploading}
          multiple={false}
          maxCount={1}
          listType="picture"
          beforeUpload={onBeforeUpload}
          onPreview={onRequestPreview}
          onRemove={onFileRemoved}
          itemRender={renderListItem}
          accept="image/png, image/jpeg, image/jpg, image/gif"
        >
          <p className="ant-upload-frag-icon">
            <AiOutlineCloudUpload size={64} color="#525252" />
          </p>
          <p className="ant-upload-text">
            Click or drag an image to this area to upload it.
          </p>
        </Upload.Dragger>
      </form>
    </Modal>
  );
}

ImageUploadModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

ImageUploadModal.defaultProps = {
  visible: true,
  onClose: () => {},
};

export default ImageUploadModal;
