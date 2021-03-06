import React from "react";
import { Segment, Loader, LoaderProps } from "semantic-ui-react";
import "./placeholder-wrapper.scss";

type Props = {
  children?: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  showDefaultMessage?: boolean;
  defaultMessage?: string;
  inverted?: boolean;
  placeholder?: boolean;
  size?: LoaderProps["size"];
};

function PlaceholderWrapper({
  children = null,
  isLoading = false,
  loadingMessage,
  showDefaultMessage = false,
  defaultMessage,
  inverted = false,
  placeholder = false,
  size = "massive",
}: Props) {
  return isLoading || showDefaultMessage ? (
    <Segment
      className="placeholder-wrapper"
      basic
      placeholder={placeholder}
      textAlign="center"
    >
      {isLoading && (
        <Loader
          size={size}
          active
          inverted={inverted}
          inline
          content={loadingMessage}
        />
      )}
      {!isLoading && showDefaultMessage && defaultMessage && (
        <h2 className="default-message">{defaultMessage}</h2>
      )}
    </Segment>
  ) : (
    <>{children}</>
  );
}

export default PlaceholderWrapper;
