import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Popup, Segment, Button } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import { toast } from "react-toastify";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import {
  useGetAllUserInvites,
  useUpdateUserInvites,
} from "../../custom-hooks/api";
import { useVirtualizedTableState } from "../../custom-hooks";
import { UserInviteData, UserInvitePatchData } from "../../types/users";
import UserInvitesTableActionsCellRenderer from "../user-invites-table-actions-cell-renderer";
import { VirtualizedTableStateOptions } from "../../custom-hooks/use-virtualized-table-state";
import { displayDatetime } from "../../utils/parsers";
import {
  CREATED_AT,
  CREATED_AT_STRING,
  EMAIL,
  ID,
  ROLE,
} from "../../constants";

const UserInvitesTableStateOptions: VirtualizedTableStateOptions = {
  defaultSortBy: CREATED_AT,
  defaultSortDirection: "DESC",
  searchIndex: ID,
  searchKeys: [EMAIL, CREATED_AT_STRING, ROLE],
};

type UserInviteDisplayData = UserInviteData & {
  createdAtString: string;
};

function UserInvitesSection() {
  const {
    userInvites,
    getAllUserInvites: _getAllUserInvites,
  } = useGetAllUserInvites();
  const { updateUserInvites: _updateUserInvites } = useUpdateUserInvites();

  const [isLoading, setLoading] = useState(false);

  const getAllUserInvites = useCallback(async () => {
    setLoading(true);
    const userInvites = await _getAllUserInvites();
    setLoading(false);
    return userInvites;
  }, [_getAllUserInvites]);

  const updateUserInvites = useCallback(
    async (users: UserInvitePatchData[]) => {
      try {
        const updatedUserInvites = await _updateUserInvites(users);

        await _getAllUserInvites();

        toast.success(
          updatedUserInvites.length > 1
            ? "Pending registration users updated successfully."
            : "The pending registration user has been updated successfully.",
        );

        return updatedUserInvites;
      } catch (error) {
        toast.warn("No pending registration users were updated.");
        return [];
      }
    },
    [_updateUserInvites, _getAllUserInvites],
  );

  useEffect(() => {
    getAllUserInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userInviteDisplayData: UserInviteDisplayData[] = useMemo(
    () =>
      userInvites.map((userInvite) => ({
        ...userInvite,
        createdAtString: displayDatetime(userInvite.createdAt),
      })),
    [userInvites],
  );

  const {
    tableRef,
    processedData: processedUserInvites,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(
    userInviteDisplayData,
    UserInvitesTableStateOptions,
  );

  return (
    <Segment.Group raised>
      <Segment secondary>
        <div className="action-container">
          <SearchBar
            className="flex-grow"
            searchValue={searchValue}
            onSearchValueChange={onSearchValueChange}
            fluid
          />
          <Popup
            content="Refresh"
            trigger={
              <Button
                className="left-space-margin"
                icon="refresh"
                color="blue"
                onClick={getAllUserInvites}
              />
            }
            position="top center"
            on="hover"
          />
        </div>
      </Segment>

      <Segment className="virtualized-table-wrapper">
        <AutoSizer onResize={() => tableRef.current?.recomputeRowHeights()}>
          {({ width, height }) => (
            <Table
              ref={tableRef}
              height={height}
              width={width}
              headerHeight={height * 0.1}
              rowGetter={({ index }) => processedUserInvites[index]}
              rowHeight={height * 0.1}
              rowCount={isLoading ? 0 : processedUserInvites.length}
              overscanRowCount={20}
              noRowsRenderer={() => (
                <PlaceholderWrapper
                  showDefaultMessage
                  defaultMessage="No pending registration users"
                  placeholder
                  isLoading={isLoading}
                  loadingMessage="Retrieving pending registration users"
                />
              )}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={setSortParams}
            >
              <Column dataKey={EMAIL} label="Email" width={width * 0.4} />
              <Column
                dataKey={CREATED_AT}
                label="Created at"
                width={width * 0.25}
                cellRenderer={({ cellData, rowData }) =>
                  rowData?.[CREATED_AT_STRING] ?? cellData
                }
              />
              <Column
                dataKey={ROLE}
                label="Role"
                width={width * 0.2}
                cellRenderer={({ cellData }) =>
                  cellData?.toLowerCase() ?? cellData
                }
                className="capitalize-text"
              />
              <Column
                dataKey={ID}
                label="Actions"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.15}
                disableSort
                cellRenderer={({ rowData }) => (
                  <UserInvitesTableActionsCellRenderer
                    rowData={rowData}
                    getAllUserInvites={getAllUserInvites}
                    updateUserInvites={updateUserInvites}
                  />
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </Segment>
    </Segment.Group>
  );
}

export default UserInvitesSection;
