import '../scss/image-upload-modal.scss';
import React, { useState } from 'react';
import { Modal, Upload, Alert } from 'antd';
import PropTypes from 'prop-types';
import { AiOutlineInbox } from 'react-icons/ai';
import TextInput from './TextInput.jsx';

const { Dragger } = Upload;

function ImageUploadModal({ visible, onClose }) {
  // eslint-disable-next-line no-unused-vars
  const [imageCaption, setImageCaption] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setUploading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const previewImage = new Image();
  const [debugTimeoutId, setDebugTimeoutId] = useState(null);

  // Adds a custom input below ant's list item component
  const renderListItem = originNode => (
    <>
      {originNode}
      <div className="input-wrapper">
        <p className="input-title">
          Image Caption <span className="subtitle">(Optional)</span>
        </p>
        <TextInput className="caption-input" onChange={setImageCaption} />
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

  const uploadImage = () => {
    if (isUploading) {
      return;
    }

    setHasError(false);
    setUploading(true);

    // TODO: Make API request here. This is just to test
    const id = setTimeout(() => {
      setUploading(false);
      setHasError(true);
    }, 3000);

    setDebugTimeoutId(id);
  };

  // Make sure the state resets when the modal is closed
  const onRequestClose = () => {
    clearTimeout(debugTimeoutId);
    setHasError(false);
    setFile(null);
    setUploading(false);
    onClose();
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
      okText={isUploading ? 'Uploading...' : 'Upload'}
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
        accept="image/png, image/jpeg, image/jpg"
      >
        <p className="ant-upload-frag-icon">
          <AiOutlineInbox size={64} color="#525252" />
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
