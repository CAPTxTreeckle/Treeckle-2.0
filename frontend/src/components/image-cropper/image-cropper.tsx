import React, { useEffect } from "react";
import Cropper from "react-easy-crop";
import {
  Button,
  Divider,
  Modal,
  TransitionablePortal,
} from "semantic-ui-react";
// @ts-ignore
import Slider from "semantic-ui-react-slider";
import { useImageCropperState } from "../../custom-hooks";
import "./image-cropper.scss";

type Props = {
  image: string;
  fixedAspectRatio?: number;
  onCropImage: (image: string) => void;
  onCancel?: () => void;
  enableRotation?: boolean;
  modal?: boolean;
};

function ImageCropper({
  image,
  fixedAspectRatio,
  onCropImage,
  enableRotation = false,
  onCancel,
  modal = false,
}: Props) {
  const {
    cropperRef,
    cropSize,
    crop,
    zoom,
    rotation,
    scaleHeight,
    onCropChange,
    onZoomChange,
    onRotationChange,
    onCropComplete,
    onConfirmCrop,
    onSliderValuesChange,
    reset,
    isCropping,
  } = useImageCropperState(
    image,
    onCropImage,
    enableRotation,
    fixedAspectRatio,
  );

  useEffect(() => {
    reset();
  }, [image, reset]);

  useEffect(() => {
    scaleHeight();
    window.addEventListener("resize", scaleHeight);
    return () => window.removeEventListener("resize", scaleHeight);
  }, [scaleHeight]);

  const cropper = (
    <div>
      <div className="image-cropper" ref={cropperRef}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={fixedAspectRatio}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          showGrid={false}
          minZoom={0.75}
          maxZoom={4}
          restrictPosition={false}
          rotation={rotation}
          onRotationChange={onRotationChange}
          cropSize={cropSize}
        />
      </div>

      {enableRotation && (
        <>
          <Divider />
          <Slider
            sliderMinValue={0}
            sliderMaxValue={360}
            onSliderValuesChange={onSliderValuesChange}
            selectedMinValue={0}
            selectedMaxValue={rotation}
          />
        </>
      )}

      <Divider />
      <div className="action-container justify-center">
        {onCancel && (
          <Button
            type="button"
            icon="close"
            color="red"
            content="Cancel"
            onClick={onCancel}
          />
        )}
        <Button
          type="button"
          icon="repeat"
          secondary
          content="Reset"
          onClick={reset}
        />
        <Button
          type="button"
          icon="checkmark"
          color="green"
          content="Confirm"
          onClick={onConfirmCrop}
          loading={isCropping}
        />
      </div>
    </div>
  );

  return modal ? (
    <TransitionablePortal open transition={{ animation: "fade down" }}>
      <Modal open size="tiny" closeIcon onClose={onCancel}>
        <Modal.Content>{cropper}</Modal.Content>
      </Modal>
    </TransitionablePortal>
  ) : (
    <>{cropper}</>
  );
}

export default ImageCropper;
