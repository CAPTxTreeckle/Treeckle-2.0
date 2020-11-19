import { useCallback, useState } from "react";

export default function useImageUploadCropperState(
  onImageChange?: (image?: string) => void,
) {
  const [uploadedImageData, setUploadedImageData] = useState<string>();
  const [croppedImage, setCroppedImage] = useState<string>();

  const onAcceptImageFile = useCallback((imageFiles: File[]) => {
    const imageFile = imageFiles?.[0];

    if (!imageFile) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = e?.target?.result as string;
      if (data) {
        setUploadedImageData(data);
      }
    };
    fileReader.readAsDataURL(imageFile);
  }, []);

  const onClickBack = useCallback(() => {
    setCroppedImage(undefined);
    onImageChange?.(undefined);
  }, [onImageChange]);

  const onClickChange = useCallback(() => {
    setCroppedImage(undefined);
    setUploadedImageData(undefined);
    onImageChange?.(undefined);
  }, [onImageChange]);

  const onClickCropImage = useCallback(
    (image: string) => {
      setCroppedImage(image);
      onImageChange?.(image);
    },
    [onImageChange],
  );

  const onClickCancel = useCallback(() => setUploadedImageData(undefined), []);

  return {
    croppedImage,
    uploadedImageData,
    setCroppedImage,
    onAcceptImageFile,
    onClickBack,
    onClickChange,
    onClickCropImage,
    onClickCancel,
  };
}
