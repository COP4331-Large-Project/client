import '../scss/image-upload-modal.scss';
import React, { useEffect, useState } from 'react';
// prettier-ignore
import {
  Modal,
  Upload,
  Alert,
  Input,
  Tooltip,
  notification,
  Progress,
} from 'antd';
import PropTypes from 'prop-types';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import axios from 'axios';
import { useUserState } from '../contexts/UserContextDispatch.jsx';
import { useGroups, useGroupsState } from '../contexts/GroupsContextDispatch.jsx';
import API from '../api/API';

// 2 megabytes
const MAX_FILE_SIZE = 2e6;
const PROGRESS_NOTIFICATION_KEY = 'upload-progress';

function ImageUploadModal({ visible, onClose }) {
  const [imageCaption, setImageCaption] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(new Image());
  const [hasError, setHasError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [cancelTokenSource, setCancelTokenSource] = useState(
    axios.CancelToken.source(),
  );
  // This allows us to keep the current state of the modal if the user
  // has selected a file, but hasn't uploaded it yet.
  const [shouldDestroyOnClose, setShouldDestroyOnClose] = useState(true);

  const { groups, index } = useGroupsState();
  const { dispatch } = useGroups();
  const user = useUserState();

  // Adds a custom input below ant's list item component
  const renderListItem = originNode => (
    <>
      <Tooltip
        title="Click to preview"
        mouseEnterDelay={0.4}
        mouseLeaveDelay={0}
      >
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
    // Set to false so the user doesn't have to choose this image
    // again after the modal is closed
    setShouldDestroyOnClose(false);
    setFile(inputFile);

    const image = new Image();

    image.src = URL.createObjectURL(inputFile);

    image.style.width = '100%';
    image.style.height = '100%';
    image.style.objectFit = 'contain';

    image.onload = () => {
      // Release the image blob to free browser memory
      URL.revokeObjectURL(previewImage.src);
      setPreviewImage(image);
    };

    setHasError(false);

    // Returning false prevents ant from automatically uploading the
    // image right after the user selects an image
    return false;
  };

  const onFileRemoved = () => {
    setFile(null);
    setHasError(false);
    setShouldDestroyOnClose(true);
  };

  const onRequestPreview = ({ thumbUrl }) => {
    // The browser won't properly display the image
    // in a new tab so we need to create an image with the data URI.
    // This allows us to customize how we render the image.
    if (!thumbUrl) {
      return;
    }

    const previewWindow = window.open(thumbUrl, '_blank');

    // Opening a new window that's on a different domain prevents
    // us from modifying that tab's title and styling so we need
    // to do that manually using document.write
    previewWindow.document.write(/* html */ `
      <title>Preview - ImageUs</title>
      <style>
        body {
          margin: 0;
        }
      </style>
      <body>${previewImage.outerHTML}</body>
    `);
  };

  const cancelUpload = () => {
    cancelTokenSource.cancel();
    notification.close(PROGRESS_NOTIFICATION_KEY);
    setIsUploading(false);
  };

  const onUploadProgress = event => {
    setUploadProgress(Math.round((event.loaded * 100) / event.total));
  };

  const uploadImage = async event => {
    event.preventDefault();

    if (isUploading || !file) {
      return;
    }

    if (file.size >= MAX_FILE_SIZE) {
      notification.error({
        key: 'file-too-large-error',
        message: 'File Too Large',
        description: `
          This file is too large to upload.
          The max file size is ${MAX_FILE_SIZE / 1e6} MB.
        `,
      });
      return;
    }

    setHasError(false);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const image = await API.uploadGroupImage(
        {
          image: file,
          caption: imageCaption.trim(),
          userId: user.id,
          groupId: groups[index].id,
        },
        onUploadProgress,
        cancelTokenSource.token,
      );

      dispatch({
        type: 'addImage',
        payload: image,
      });

      // Reset the state of the modal when the image finishes uploading
      setIsUploading(false);
      setFile(null);
      setImageCaption('');
      setShouldDestroyOnClose(true);
      onClose();
    } catch (err) {
      notification.close(PROGRESS_NOTIFICATION_KEY);
      setIsUploading(false);

      if (err.status !== 499) {
        setHasError(true);
      }
    }

    // A new cancel token needs to be generated on each request
    // https://github.com/axios/axios/issues/904#issuecomment-322054741
    setCancelTokenSource(axios.CancelToken.source());
  };

  useEffect(() => {
    if (uploadProgress === -1) {
      return;
    }

    notification.open({
      key: PROGRESS_NOTIFICATION_KEY,
      closeIcon: <div />,
      duration: 0,
      message: 'Uploading Image',
      description: <Progress active type="line" percent={uploadProgress} />,
    });

    // Delay closing the notification when the upload completes
    if (uploadProgress === 100) {
      setTimeout(() => {
        notification.close(PROGRESS_NOTIFICATION_KEY);
      }, 2000);
    }
  }, [uploadProgress]);

  const getOkText = () => {
    if (isUploading) {
      return 'Uploading...';
    }

    if (hasError) {
      return 'Retry';
    }

    return 'Upload';
  };

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    // When switching groups, the notification won't update
    // because this gets component gets unmounted. We need
    // to close the notification so it doesn't stay open
    return () => notification.close(PROGRESS_NOTIFICATION_KEY);
  }, []);

  return (
    <Modal
      centered
      destroyOnClose={shouldDestroyOnClose}
      title="Upload Image"
      visible={visible}
      className="image-upload-modal"
      okButtonProps={{
        disabled: file === null,
        loading: isUploading,
      }}
      cancelButtonProps={{
        className: 'cancel-btn',
        danger: isUploading,
        onClick: isUploading ? cancelUpload : onClose,
      }}
      cancelText={isUploading ? 'Cancel' : 'Close'}
      onOk={uploadImage}
      onCancel={onClose}
      okText={getOkText()}
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
