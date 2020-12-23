import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

export const scrollToTop = (behavior: "auto" | "smooth" = "auto") =>
  window.scrollTo({ top: 0, left: 0, behavior });

function ScrollToTopWrapper({ children }: Props) {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => scrollToTop());

    return unlisten;
  }, [history]);

  return <>{children}</>;
}

export default ScrollToTopWrapper;
