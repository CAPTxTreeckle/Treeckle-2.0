import { useCallback, useEffect, useRef, useState } from "react";
import { SortDirectionType, Table } from "react-virtualized";
import { UserInviteData } from "../types/users";
import arraySort from "array-sort";

export default function useUserInvitesTableState(
  userInvites: UserInviteData[],
) {
  const [sortedUserInvites, setSortedUserInvites] = useState<UserInviteData[]>(
    [],
  );
  const [sortBy, setSortBy] = useState<string>("email");
  const [sortDirection, setSortDirection] = useState<SortDirectionType>("ASC");
  const tableRef = useRef<Table>(null);

  const sort = useCallback(
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

  useEffect(() => {
    setSortedUserInvites(
      arraySort([...userInvites], sortBy, {
        reverse: sortDirection === "DESC",
      }),
    );
  }, [userInvites, sortBy, sortDirection]);

  return { tableRef, sortedUserInvites, sortBy, sortDirection, sort };
}
