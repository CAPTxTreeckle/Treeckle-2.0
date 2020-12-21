import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SortDirectionType, Table } from "react-virtualized";
import arraySort from "array-sort";
import throttle from "lodash.throttle";
import { generateSearchEngine } from "../utils/search-utils";

export type VirtualizedTableStateOptions = {
  defaultSortBy?: string;
  defaultSortDirection?: SortDirectionType;
  searchIndex?: string | string[];
  searchKeys?: string[] | string[][];
};

export default function useVirtualizedTableState<
  T extends Record<string, unknown>
>(
  data: T[],
  {
    defaultSortBy,
    defaultSortDirection = "ASC",
    searchIndex,
    searchKeys,
  }: VirtualizedTableStateOptions = {},
) {
  const tableRef = useRef<Table>(null);
  const [processedData, setProcessedData] = useState<T[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>(defaultSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(
    defaultSortDirection,
  );
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
    (data: T[]) => {
      if (
        !activeSearchValue ||
        !searchIndex ||
        !searchKeys ||
        searchKeys.length === 0
      ) {
        return data;
      }

      const searchEngine = generateSearchEngine(searchIndex, searchKeys, data);
      return searchEngine.search(activeSearchValue) as T[];
    },
    [activeSearchValue, searchIndex, searchKeys],
  );

  const sort = useCallback(
    (data: T[]) => {
      return sortBy
        ? arraySort([...data], sortBy, {
            reverse: sortDirection === "DESC",
          })
        : data;
    },
    [sortBy, sortDirection],
  );

  useEffect(() => {
    const filteredData = filter(data);
    const sortedData = sort(filteredData);
    setProcessedData(sortedData);
  }, [data, filter, sort]);

  return {
    tableRef,
    processedData,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  };
}
