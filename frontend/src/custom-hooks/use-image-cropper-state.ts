import { useCallback, useRef, useState } from "react";
import { Area, Point, Size } from "react-easy-crop/types";
import { getCroppedImage } from "../utils/image-utils";

const defaultAspectRatio = 4 / 3;

export default function useImageCropperState(
  image: string,
  onCropImage: (image: string) => void,
  enableRotation: boolean,
  fixedAspectRatio: number = defaultAspectRatio,
) {
  const cropperRef = useRef<HTMLDivElement>(null);
  const [cropSize, setCropSize] = useState<Size>({ width: 0, height: 0 });
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixes] = useState<Area>();
  const [isCropping, setCropping] = useState(false);

  const scaleHeight = useCallback(() => {
    if (!cropperRef.current) {
      return;
    }

    const imageCropper = cropperRef.current;

    imageCropper.style.height = `${
      imageCropper.offsetWidth / fixedAspectRatio
    }px`;

    setCropSize({
      height: imageCropper.offsetHeight * 0.9,
      width: imageCropper.offsetWidth * 0.9,
    });
  }, [fixedAspectRatio]);

  const reset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }, []);

  const onRotationChange = useCallback(
    (rotation: number) => {
      enableRotation && setRotation(rotation);
    },
    [enableRotation],
  );

  const onSliderValuesChange = useCallback(
    (minValue: number, maxValue: number) => {
      onRotationChange(maxValue);
    },
    [onRotationChange],
  );

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixes(croppedAreaPixels);
    },
    [],
  );

  const onConfirmCrop = async () => {
    if (!croppedAreaPixels) {
      return;
    }
    try {
      setCropping(true);
      const croppedImage =
        (await getCroppedImage(image, croppedAreaPixels, rotation)) ?? "";
      onCropImage(croppedImage);
    } catch (error) {
      console.log(error, error?.response);
    } finally {
      setCropping(false);
    }
  };

  return {
    cropperRef,
    cropSize,
    crop,
    zoom,
    rotation,
    scaleHeight,
    onCropChange: setCrop,
    onZoomChange: setZoom,
    onRotationChange,
    onCropComplete,
    onConfirmCrop,
    onSliderValuesChange,
    reset,
    isCropping,
  };
}
