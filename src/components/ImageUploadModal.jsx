import '../scss/image-upload-modal.scss';
import React, { useContext, useState } from 'react';
import { Modal, Upload, Alert } from 'antd';
import PropTypes from 'prop-types';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import TextInput from './TextInput.jsx';
import GroupStateContext from '../contexts/GroupStateContext.jsx';
import UserContext from '../contexts/UserContext.jsx';
import API from '../api/API';

const { Dragger } = Upload;

function ImageUploadModal({ visible, onClose }) {
  // eslint-disable-next-line no-unused-vars
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
      {originNode}
      <div className="input-wrapper">
        <p className="input-title">
          Image Caption <span className="subtitle">(Optional)</span>
        </p>
        <TextInput className="caption-input" onChange={setImageCaption} />
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
    // Sometimes the browser won't properly display the image
    // in a new tab so we need to create an image with the data URI
    if (thumbUrl) {
      previewImage.src = thumbUrl;

      const newWindow = window.open(thumbUrl, '_blank');
      newWindow.document.write(previewImage.outerHTML);
    }
  };

  // Make sure the state resets when the modal is closed
  const onRequestClose = () => {
    setHasError(false);
    setFile(null);
    setUploading(false);
    onClose();
  };

  const uploadImage = async () => {
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
        // TODO: Remove the _id check
        // eslint-disable-next-line no-underscore-dangle
        groupId: groups[index]._id || groups[index].id,
      });

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
      destroyOnClose
      title="Upload Image"
      visible={visible}
      className="image-upload-modal"
      okButtonProps={{
        disabled: file === null,
        loading: isUploading,
      }}
      cancelText="Close"
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
      <Dragger
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
      </Dragger>
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
