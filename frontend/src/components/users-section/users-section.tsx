import React, { useCallback, useEffect, useState } from "react";
import { Popup, Segment, Button } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import { toast } from "react-toastify";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import { useVirtualizedTableState } from "../../custom-hooks";
import UsersTableActionsCellRenderer from "../users-table-actions-cell-renderer";
import { UserData, UserPatchData } from "../../types/users";
import {
  useGetAllExistingUsers,
  useUpdateExistingUsers,
} from "../../custom-hooks/api";
import { VirtualizedTableStateOptions } from "../../custom-hooks/use-virtualized-table-state";

type UsersSectionContextType = {
  getAllExistingUsers: () => Promise<UserData[]>;
  updateExistingUsers: (users: UserPatchData[]) => Promise<UserData[]>;
};

export const UsersSectionContext = React.createContext<UsersSectionContextType>(
  {
    getAllExistingUsers: () => {
      throw new Error("getAllExistingUsers not defined.");
    },
    updateExistingUsers: () => {
      throw new Error("updateExistingUsers not defined.");
    },
  },
);

const UsersTableStateOptions: VirtualizedTableStateOptions = {
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

  const [isLoading, setLoading] = useState(false);

  const getAllExistingUsers = useCallback(async () => {
    setLoading(true);
    const existingUsers = await _getAllExistingUsers();
    setLoading(false);
    return existingUsers;
  }, [_getAllExistingUsers]);

  const updateExistingUsers = useCallback(
    async (users: UserPatchData[]) => {
      try {
        const updatedExistingUsers = await _updateExistingUsers(users);

        await _getAllExistingUsers();

        toast.success(
          `Existing user${
            updatedExistingUsers.length > 1 ? "s" : ""
          } updated successfully.`,
        );

        return updatedExistingUsers;
      } catch (error) {
        return [];
      }
    },
    [_updateExistingUsers, _getAllExistingUsers],
  );

  useEffect(() => {
    getAllExistingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    tableRef,
    processedData: processedUsers,
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
      <h1 className="section-title-container">
        <div className="section-title">Existing Users</div>

        <div className="section-title-action-container">
          <Popup
            content="Refresh"
            trigger={
              <Button
                icon="refresh"
                color="blue"
                onClick={getAllExistingUsers}
              />
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

      <Segment className="virtualized-table-wrapper" raised>
        <AutoSizer onResize={() => tableRef.current?.recomputeRowHeights()}>
          {({ width, height }) => (
            <Table
              ref={tableRef}
              height={height}
              width={width}
              headerHeight={height * 0.1}
              rowGetter={({ index }) => processedUsers[index]}
              rowHeight={height * 0.1}
              rowCount={isLoading ? 0 : processedUsers.length}
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
              <Column
                dataKey="role"
                label="Role"
                width={width * 0.2}
                cellRenderer={({ cellData }) =>
                  cellData?.toLowerCase() ?? cellData
                }
                className="capitalize-text"
              />
              <Column
                dataKey="id"
                label="Actions"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.15}
                disableSort
                cellRenderer={({ rowData }) => (
                  <UsersTableActionsCellRenderer rowData={rowData} />
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
