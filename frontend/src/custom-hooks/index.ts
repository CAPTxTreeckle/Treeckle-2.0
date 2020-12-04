import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

export { default as useOptionsState } from "./use-options-state";
export { default as useStateWithCallback } from "./use-state-with-callback";
export { default as useAllowSignUp } from "./use-allow-sign-up";
export { default as useImageCropperState } from "./use-image-cropper-state";
export { default as useImageUploadCropperState } from "./use-image-upload-cropper-state";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useScrollToTop(
  showScrollYOffset?: number,
): [boolean, (behavior: "auto" | "smooth") => void] {
  const [showScroll, setShowScroll] = useState(false);

  const onScroll = useCallback(() => {
    if (showScrollYOffset === undefined) {
      return;
    }

    if (!showScroll && window.pageYOffset > showScrollYOffset) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= showScrollYOffset) {
      setShowScroll(false);
    }
  }, [showScroll, setShowScroll, showScrollYOffset]);

  const scrollToTop = useCallback(
    (behavior: "auto" | "smooth" = "auto") =>
      window.scrollTo({ top: 0, left: 0, behavior }),
    [],
  );

  useEffect(scrollToTop, [scrollToTop]);

  useEffect(() => {
    if (showScrollYOffset !== undefined && showScrollYOffset >= 0) {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [onScroll, showScrollYOffset]);

  return [showScroll, scrollToTop];
}
