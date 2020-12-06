import React, { useEffect } from "react";
import { useImageUploadCropperState } from "../../custom-hooks";
import FileUploader from "../file-uploader/file-uploader";
import ImageCropper from "../image-cropper/image-cropper";
import ImagePreviewController from "../image-preview-controller";

type Props = {
  onChange?: (value?: string) => void;
  value?: string;
  fixedAspectRatio?: number;
};

function ImageUploadCropper({ onChange, value, fixedAspectRatio }: Props) {
  const {
    croppedImage,
    uploadedImageData,
    setCroppedImage,
    onAcceptImageFile,
    onClickBack,
    onClickChange,
    onClickCropImage,
    onClickCancel,
  } = useImageUploadCropperState(onChange);

  useEffect(() => {
    setCroppedImage(value);
  }, [value, setCroppedImage]);

  const renderView = () => {
    if (croppedImage) {
      return (
        <ImagePreviewController
          image={croppedImage}
          showBackControl={!!uploadedImageData}
          showChangeControl
          onBack={onClickBack}
          onChange={onClickChange}
        />
      );
    }
    if (uploadedImageData) {
      return (
        <ImageCropper
          fixedAspectRatio={fixedAspectRatio}
          image={uploadedImageData}
          onCropImage={onClickCropImage}
          onCancel={onClickCancel}
        />
      );
    }
    return (
      <FileUploader
        onAcceptFiles={onAcceptImageFile}
        accept={["image/jpeg", "image/png", "image/gif"]}
        maxFileSize={2000000}
        title="Drag and drop, or click here to upload image."
        description="Maximum accepted image size is 2MB."
      />
    );
  };

  return renderView();
}

export default ImageUploadCropper;
