import { useState, useCallback, useEffect } from "react";

export default function useScrollToTop(
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
