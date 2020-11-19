import React from "react";
import { Segment, Loader as SUILoader, Dimmer } from "semantic-ui-react";
import "./placeholder-wrapper.scss";

type Props = {
  children?: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  showDefaultMessage?: boolean;
  defaultMessage?: string;
  inverted?: boolean;
  placeholder?: boolean;
  withDimmer?: boolean;
  className?: string;
};

function PlaceholderWrapper({
  children,
  isLoading,
  loadingMessage,
  showDefaultMessage,
  defaultMessage,
  className,
  inverted = false,
  placeholder = false,
  withDimmer = false,
}: Props) {
  function Loader() {
    return (
      <SUILoader
        size="massive"
        active
        inverted={inverted}
        inline
        content={loadingMessage}
      />
    );
  }

  return isLoading || showDefaultMessage ? (
    <Segment
      id="placeholder-wrapper"
      basic
      placeholder={placeholder}
      textAlign="center"
      className={className}
    >
      {isLoading &&
        (withDimmer ? (
          <Dimmer active inverted={inverted}>
            <Loader />
          </Dimmer>
        ) : (
          <Loader />
        ))}
      {!isLoading && showDefaultMessage && (
        <h2 className="default-message">{defaultMessage}</h2>
      )}
    </Segment>
  ) : (
    <>{children}</>
  );
}

export default PlaceholderWrapper;
