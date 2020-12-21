import { useState, useCallback, useEffect } from "react";

export default function useShowScroller(showScrollerYOffset?: number) {
  const [showScroller, setShowScroller] = useState(false);

  const onScroll = useCallback(() => {
    if (showScrollerYOffset === undefined) {
      return;
    }

    setShowScroller(window.pageYOffset > showScrollerYOffset);
  }, [showScrollerYOffset]);

  useEffect(() => {
    if (showScrollerYOffset !== undefined && showScrollerYOffset >= 0) {
      onScroll();
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [onScroll, showScrollerYOffset]);

  return { showScroller };
}
