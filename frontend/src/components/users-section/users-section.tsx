import React, { useCallback, useEffect, useRef, useState } from "react";
import { Popup, Icon, Segment } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import { useVirtualizedTableState } from "../../custom-hooks";
import UsersTableActionsCellRenderer from "../users-table-actions-cell-renderer";
import { UserData, UserPatchData } from "../../types/users";
import "./users-section.scss";
import {
  useGetAllExistingUsers,
  useUpdateExistingUsers,
} from "../../custom-hooks/api";

type UsersSectionContextType = {
  getAllExistingUsers: () => Promise<UserData[]>;
  updateExistingUsers: (users: UserPatchData[]) => Promise<UserData[]>;
};

export const UsersSectionContext = React.createContext<UsersSectionContextType>(
  {
    getAllExistingUsers: () => {
      throw new Error("getAllExistingUsers not defined");
    },
    updateExistingUsers: () => {
      throw new Error("updateExistingUsers not defined");
    },
  },
);

const UsersTableStateOptions = {
  defaultSortBy: "role",
  searchIndex: "id",
  searchKeys: ["name", "email", "role"],
};

function UsersSection() {
  const {
    existingUsers,
    getAllExistingUsers: _getAllExistingUsers,
  } = useGetAllExistingUsers();
  const {
    updateExistingUsers: _updateExistingUsers,
  } = useUpdateExistingUsers();

  const tableRef = useRef<Table>(null);
  const [isLoading, setLoading] = useState(false);

  const getAllExistingUsers = useCallback(async () => {
    setLoading(true);
    const existingUsers = await _getAllExistingUsers();
    setLoading(false);
    return existingUsers;
  }, [_getAllExistingUsers]);

  const updateExistingUsers = useCallback(
    async (users: UserPatchData[]) => {
      return await _updateExistingUsers(users, _getAllExistingUsers);
    },
    [_updateExistingUsers, _getAllExistingUsers],
  );

  useEffect(() => {
    getAllExistingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    processedData: processedUserInvites,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(existingUsers, UsersTableStateOptions);

  return (
    <UsersSectionContext.Provider
      value={{
        getAllExistingUsers,
        updateExistingUsers,
      }}
    >
      <h1>
        Existing Users{" "}
        <Popup
          content="Refresh"
          trigger={<Icon name="refresh" link onClick={getAllExistingUsers} />}
          position="top center"
          on="hover"
        />
      </h1>

      <SearchBar
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        fluid
      />

      <Segment
        className="virtualized-table-wrapper existing-users-table"
        raised
      >
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
                  defaultMessage="No existing users"
                  placeholder
                  isLoading={isLoading}
                  loadingMessage="Retrieving existing users"
                />
              )}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={setSortParams}
            >
              <Column dataKey="name" label="Name" width={width * 0.25} />
              <Column dataKey="email" label="Email" width={width * 0.4} />
              <Column dataKey="role" label="Role" width={width * 0.2} />
              <Column
                dataKey="id"
                label="Actions"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.15}
                disableSort={true}
                cellDataGetter={({ rowData }) => rowData}
                cellRenderer={({ cellData }) => (
                  <UsersTableActionsCellRenderer cellData={cellData} />
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </Segment>
    </UsersSectionContext.Provider>
  );
}

export default UsersSection;
