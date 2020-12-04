import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useQuery() {
  const location = useLocation();
  const [params, setParams] = useState(location.search);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(location.search),
  );

  useEffect(() => {
    if (params === location.search) {
      return;
    }
    setParams(location.search);
    setSearchParams(new URLSearchParams(location.search));
  }, [location.search, params]);

  return searchParams;
}
