import { useCallback, useEffect, useMemo, useState } from "react";
import { SortDirectionType } from "react-virtualized";
import arraySort from "array-sort";
import throttle from "lodash.throttle";
import { generateSearchEngine } from "../utils/search-utils";

export default function useVirtualizedTableState(
  data: Record<string, unknown>[],
  {
    defaultSortBy,
    searchIndex,
    searchKeys,
  }: {
    defaultSortBy?: string;
    searchIndex?: string | string[];
    searchKeys?: string[] | string[][];
  } = {},
) {
  const [processedData, setProcessedData] = useState<Record<string, unknown>[]>(
    [],
  );
  const [sortBy, setSortBy] = useState<string | undefined>(defaultSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirectionType>("ASC");
  const [searchValue, setSearchValue] = useState("");
  const [activeSearchValue, setActiveSearchValue] = useState("");

  const setSortParams = useCallback(
    ({
      sortBy: newSortBy,
      sortDirection: newSortDirection,
    }: {
      sortBy: string;
      sortDirection: SortDirectionType;
    }) => {
      setSortBy(newSortBy);
      setSortDirection(newSortDirection);
    },
    [],
  );

  const throttledSetActiveSearchValue = useMemo(
    () => throttle(setActiveSearchValue, 300),
    [],
  );

  const onSearchValueChange = useCallback(
    (newValue: string) => {
      setSearchValue(newValue);
      throttledSetActiveSearchValue(newValue);
    },
    [throttledSetActiveSearchValue],
  );

  const filter = useCallback(
    (data: Record<string, unknown>[]) => {
      if (
        !activeSearchValue ||
        !searchIndex ||
        !searchKeys ||
        searchKeys.length <= 0
      ) {
        return data;
      }

      const searchEngine = generateSearchEngine(searchIndex, searchKeys, data);
      return searchEngine.search(activeSearchValue) as Record<
        string,
        unknown
      >[];
    },
    [activeSearchValue, searchIndex, searchKeys],
  );

  const sort = useCallback(
    (data: Record<string, unknown>[]) => {
      return arraySort([...data], sortBy, {
        reverse: sortDirection === "DESC",
      });
    },
    [sortBy, sortDirection],
  );

  useEffect(() => {
    const filteredData = filter(data);
    const sortedData = sort(filteredData);
    setProcessedData(sortedData);
  }, [data, filter, sort]);

  return {
    processedData,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  };
}
