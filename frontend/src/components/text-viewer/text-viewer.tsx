import React from "react";
import Linkify from "linkifyjs/react";
import "./text-viewer.scss";

type Props = {
  children: React.ReactNode;
};

function TextViewer({ children }: Props) {
  return (
    <Linkify tagName="div">
      <div className="text-viewer">{children}</div>
    </Linkify>
  );
}

export default TextViewer;
