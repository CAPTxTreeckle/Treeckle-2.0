import React from "react";
import { Button, Divider, Image } from "semantic-ui-react";
import "./image-preview-controller.scss";

type Props = {
  image: string;
  showBackControl?: boolean;
  onBack?: () => void;
  showChangeControl?: boolean;
  onChange?: () => void;
};

function ImagePreviewController({
  image,
  showBackControl = false,
  onBack,
  showChangeControl = false,
  onChange,
}: Props) {
  return (
    <div id="image-preview-controller">
      <Image
        className="preview-image"
        fluid
        src={image}
        alt=""
        rounded
        centered
      />

      {(showBackControl || showChangeControl) && (
        <>
          <Divider />
          <div className="action-button-container justify-center">
            {showBackControl && (
              <Button
                type="button"
                secondary
                icon="arrow left"
                content="Back"
                onClick={onBack}
              />
            )}
            {showChangeControl && (
              <Button
                type="button"
                primary
                icon="sync"
                content="Change"
                onClick={onChange}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ImagePreviewController;
