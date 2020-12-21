import React, { useContext, useEffect } from "react";
import { Popup, Segment, Button } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import { useVirtualizedTableState } from "../../custom-hooks";
import UserTableActionsCellRenderer from "../user-table-actions-cell-renderer";
import { VirtualizedTableStateOptions } from "../../custom-hooks/use-virtualized-table-state";
import { EMAIL, ID, NAME, ROLE } from "../../constants";
import { ExistingUsersContext } from "../../context-providers";

const UsersTableStateOptions: VirtualizedTableStateOptions = {
  defaultSortBy: ROLE,
  searchIndex: ID,
  searchKeys: [NAME, EMAIL, ROLE],
};

function UserTable() {
  const { existingUsers, isLoading, getAllExistingUsers } = useContext(
    ExistingUsersContext,
  );

  useEffect(() => {
    getAllExistingUsers();
  }, [getAllExistingUsers]);

  const {
    processedData: processedUsers,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(existingUsers, UsersTableStateOptions);

  return (
    <Segment.Group raised>
      <Segment secondary>
        <div className="action-container horizontal-space-margin">
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
                icon="refresh"
                color="blue"
                onClick={getAllExistingUsers}
              />
            }
            position="top center"
            on="hover"
          />
        </div>
      </Segment>

      <Segment className="virtualized-table-wrapper">
        <AutoSizer>
          {({ width, height }) => (
            <Table
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
              <Column dataKey={NAME} label="Name" width={width * 0.25} />
              <Column dataKey={EMAIL} label="Email" width={width * 0.4} />
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
                  <UserTableActionsCellRenderer rowData={rowData} />
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </Segment>
    </Segment.Group>
  );
}

export default UserTable;
