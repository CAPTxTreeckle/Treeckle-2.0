import React, { useEffect } from "react";
import Cropper from "react-easy-crop";
import { Button, Divider } from "semantic-ui-react";
// @ts-ignore
import Slider from "semantic-ui-react-slider";
import { useImageCropperState } from "../../custom-hooks";
import "./image-cropper.scss";

const defaultAspectRatio = 4 / 3;
let inputAspectRatio = defaultAspectRatio;
let height = 0;
let width = 0;

const scaleHeight = () => {
  const imageCropper = document.getElementById("image-cropper");

  if (!imageCropper) {
    return;
  }

  imageCropper.style.height = `${
    imageCropper.offsetWidth / inputAspectRatio
  }px`;

  height = imageCropper.offsetHeight * 0.9;
  width = imageCropper.offsetWidth * 0.9;
};

type Props = {
  image: string;
  fixedAspectRatio?: number;
  onCropImage: (image: string) => void;
  onCancel?: () => void;
  enableRotation?: boolean;
};

function ImageCropper({
  image,
  fixedAspectRatio = defaultAspectRatio,
  onCropImage,
  enableRotation = false,
  onCancel,
}: Props) {
  const {
    crop,
    zoom,
    rotation,
    onCropChange,
    onZoomChange,
    onRotationChange,
    onCropComplete,
    onConfirmCrop,
    onSliderValuesChange,
    reset,
    isCropping,
  } = useImageCropperState(image, onCropImage, enableRotation);

  useEffect(() => {
    reset();
    inputAspectRatio = fixedAspectRatio;
    window.addEventListener("resize", scaleHeight);
    scaleHeight();
    return () => window.removeEventListener("resize", scaleHeight);
  }, [image, fixedAspectRatio, reset]);

  return (
    <div>
      <div id="image-cropper">
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
          cropSize={{ height, width }}
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
}

export default ImageCropper;
