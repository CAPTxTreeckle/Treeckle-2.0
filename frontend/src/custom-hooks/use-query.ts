import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useQuery() {
  const location = useLocation();
  const [, setParams] = useState(location.search);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(location.search),
  );

  useEffect(() => {
    setParams((params) => {
      if (location.search === params) {
        return params;
      }

      setSearchParams(new URLSearchParams(location.search));
      return location.search;
    });
  }, [location.search]);

  return searchParams;
}
