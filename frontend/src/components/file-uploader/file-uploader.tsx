import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";
import "./file-uploader.scss";

type Props = {
  accept?: string | string[];
  multiple?: boolean;
  onAcceptFiles: (files: File[]) => void;
  maxFileSize?: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  disabled?: boolean;
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function FileUploader({
  accept,
  multiple = false,
  onAcceptFiles,
  maxFileSize,
  icon = <Icon name="file alternate" />,
  title = "Drag and drop, or click here to upload file.",
  description,
  disabled,
}: Props) {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept,
    multiple,
    onDropAccepted: onAcceptFiles,
    maxSize: maxFileSize,
    disabled,
  });

  const style = useMemo(
    () => ({
      ...(isFocused && focusedStyle),
      ...(isDragAccept && acceptStyle),
      ...(isDragReject && rejectStyle),
    }),
    [isDragAccept, isFocused, isDragReject],
  );

  return (
    <div
      {...getRootProps({
        style,
        className: "upload-container",
      })}
    >
      <input {...getInputProps()} />
      <Header icon>
        {icon}
        {title}
      </Header>
      {description && <p className="upload-prompt">{description}</p>}
    </div>
  );
}

export default FileUploader;
