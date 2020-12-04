import React, { useEffect, useRef } from "react";
import { Popup, Icon, Segment } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import DeleteButton from "../delete-button";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import DefaultHeaderRenderer from "../default-header-renderer";
import "./users-section.scss";
import {
  useDeleteExistingUsers,
  useGetAllExistingUsers,
} from "../../custom-hooks/api";
import { useVirtualizedTableState } from "../../custom-hooks";

const UsersTableStateOptions = {
  defaultSortBy: "role",
  searchIndex: "id",
  searchKeys: ["name", "email", "role"],
};

function UsersSection() {
  const {
    existingUsers,
    isLoading,
    getAllExistingUsers,
  } = useGetAllExistingUsers();
  const { deleteExistingUsers } = useDeleteExistingUsers();
  const {
    processedData: processedUserInvites,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(existingUsers, UsersTableStateOptions);
  const tableRef = useRef<Table>(null);

  useEffect(() => {
    getAllExistingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
              <Column dataKey="email" label="Email" width={width * 0.35} />
              <Column dataKey="role" label="Role" width={width * 0.15} />
              <Column
                dataKey="email"
                label="Actions"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.25}
                disableSort={true}
                headerRenderer={DefaultHeaderRenderer}
                cellRenderer={({ cellData }) => (
                  <DeleteButton
                    deleteTitle={`Delete Existing User`}
                    deleteDescription={`Are you sure you want to delete existing user (${cellData})?`}
                    onDelete={() =>
                      deleteExistingUsers([cellData], getAllExistingUsers)
                    }
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

export default UsersSection;
