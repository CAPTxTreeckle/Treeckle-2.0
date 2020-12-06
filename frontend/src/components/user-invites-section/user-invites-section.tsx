import React, { useCallback, useEffect, useRef, useState } from "react";
import { Popup, Icon, Segment, Button } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import {
  useGetAllUserInvites,
  useUpdateUserInvites,
} from "../../custom-hooks/api";
import { useVirtualizedTableState } from "../../custom-hooks";
import { UserInvitePatchData } from "../../types/users";
import UserInvitesTableActionsCellRenderer from "../user-invites-table-actions-cell-renderer";
import "./user-invites-section.scss";
import { toast } from "react-toastify";

const UserInvitesTableStateOptions = {
  defaultSortBy: "role",
  searchIndex: "id",
  searchKeys: ["email", "role"],
};

function UserInvitesSection() {
  const {
    userInvites,
    getAllUserInvites: _getAllUserInvites,
  } = useGetAllUserInvites();
  const { updateUserInvites: _updateUserInvites } = useUpdateUserInvites();

  const tableRef = useRef<Table>(null);
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
          `Pending new user${
            updatedUserInvites.length > 1 ? "s" : ""
          } updated successfully.`,
        );

        return updatedUserInvites;
      } catch (error) {
        return [];
      }
    },
    [_updateUserInvites, _getAllUserInvites],
  );

  useEffect(() => {
    getAllUserInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    processedData: processedUserInvites,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(userInvites, UserInvitesTableStateOptions);

  return (
    <>
      <h1 className="section-title-container">
        <div className="section-title">New Pending Users</div>

        <div className="section-title-action-container">
          <Popup
            content="Refresh"
            trigger={
              <Button icon="refresh" color="blue" onClick={getAllUserInvites} />
            }
            position="top center"
            on="hover"
          />
        </div>
      </h1>

      <SearchBar
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        fluid
      />

      <Segment className="virtualized-table-wrapper user-invites-table" raised>
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
                  defaultMessage="No new pending users"
                  placeholder
                  isLoading={isLoading}
                  loadingMessage="Retrieving new pending users"
                />
              )}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={setSortParams}
            >
              <Column dataKey="email" label="Email" width={width * 0.65} />
              <Column dataKey="role" label="Role" width={width * 0.2} />
              <Column
                dataKey="id"
                label="Actions"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.15}
                disableSort
                cellDataGetter={({ rowData }) => rowData}
                cellRenderer={({ cellData }) => (
                  <UserInvitesTableActionsCellRenderer
                    cellData={cellData}
                    getAllUserInvites={getAllUserInvites}
                    updateUserInvites={updateUserInvites}
                  />
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </Segment>
    </>
  );
}

export default UserInvitesSection;
