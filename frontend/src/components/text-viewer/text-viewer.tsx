import Linkify from "linkifyjs/react";
import { ReactNode } from "react";
import "./text-viewer.scss";

type Props = {
  children: ReactNode;
};

function TextViewer({ children }: Props) {
  return (
    <Linkify tagName="div">
      <div className="text-viewer">{children}</div>
    </Linkify>
  );
}

export default TextViewer;
