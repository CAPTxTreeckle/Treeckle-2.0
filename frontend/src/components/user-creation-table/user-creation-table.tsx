import React, { useCallback, useContext } from "react";
import { Table, Column, AutoSizer } from "react-virtualized";
import { Button, Segment } from "semantic-ui-react";
import { useVirtualizedTableState } from "../../custom-hooks";
import PlaceholderWrapper from "../placeholder-wrapper";
import { UserCreationSectionContext } from "../user-creation-section";
import DeleteButton from "../delete-button";
import SearchBar from "../search-bar";
import { VirtualizedTableStateOptions } from "../../custom-hooks/use-virtualized-table-state";
import DeleteModalButton from "../delete-modal-button";
import { DeleteModalProvider } from "../../context-providers";

const UserCreationTableStateOptions: VirtualizedTableStateOptions = {
  searchIndex: "email",
  searchKeys: ["email", "role", "status"],
};

function UserCreationTable() {
  const { pendingCreationUsers, setPendingCreationUsers } = useContext(
    UserCreationSectionContext,
  );
  const {
    tableRef,
    processedData: processedPendingCreationUsers,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(
    pendingCreationUsers,
    UserCreationTableStateOptions,
  );

  const onDeleteRow = useCallback(
    (emailToBeDeleted: string) => {
      const updatedPendingCreationUsers = pendingCreationUsers.filter(
        ({ email }) => email !== emailToBeDeleted,
      );
      setPendingCreationUsers(updatedPendingCreationUsers);
    },
    [pendingCreationUsers, setPendingCreationUsers],
  );

  const onDeleteAllRows = useCallback(() => {
    setPendingCreationUsers([]);
    return true;
  }, [setPendingCreationUsers]);

  return (
    <>
      <SearchBar
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        fluid
      />

      <Segment className="virtualized-table-wrapper" raised attached="top">
        <AutoSizer onResize={() => tableRef.current?.recomputeRowHeights()}>
          {({ width, height }) => (
            <Table
              ref={tableRef}
              height={height}
              width={width}
              headerHeight={height * 0.1}
              rowGetter={({ index }) => processedPendingCreationUsers[index]}
              rowHeight={height * 0.1}
              rowCount={processedPendingCreationUsers.length}
              overscanRowCount={20}
              noRowsRenderer={() => (
                <PlaceholderWrapper
                  showDefaultMessage
                  defaultMessage="No pending creation users"
                  placeholder
                />
              )}
            >
              <Column dataKey="email" label="Email" width={width * 0.45} />
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
                dataKey="status"
                label="Status"
                width={width * 0.2}
                cellRenderer={({ cellData }) =>
                  cellData?.toLowerCase() ?? cellData
                }
                className="capitalize-text"
              />
              <Column
                dataKey="email"
                label="Action"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.15}
                cellRenderer={({ cellData }) => (
                  <DeleteButton
                    compact
                    onDelete={() => onDeleteRow(cellData)}
                  />
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </Segment>

      <Segment attached="bottom">
        <div className="action-button-container justify-end">
          <DeleteModalProvider
            onDelete={onDeleteAllRows}
            deleteTitle="Delete All Pending Creation Users"
            deleteDescription="Are you sure you want to delete all pending creation users?"
          >
            <DeleteModalButton
              label="Delete All"
              popUpContent={null}
              icon={null}
            />
          </DeleteModalProvider>

          <Button content="Create Users" color="blue" />
        </div>
      </Segment>
    </>
  );
}

export default UserCreationTable;
