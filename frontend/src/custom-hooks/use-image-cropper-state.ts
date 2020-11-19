import { useCallback, useState } from "react";
import { Area, Point } from "react-easy-crop/types";
import { getCroppedImage } from "../utils/image-utils";

export default function useImageCropperState(
  image: string,
  onCropImage: (image: string) => void,
  enableRotation: boolean,
) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixes] = useState<Area>();
  const [isCropping, setCropping] = useState(false);

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
    crop,
    zoom,
    rotation,
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
