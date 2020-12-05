import React, { useEffect, useRef } from "react";
import { Popup, Icon, Segment, Button } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import DeleteButton from "../delete-button";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import DefaultHeaderRenderer from "../default-header-renderer";
import "./user-invites-section.scss";
import {
  useDeleteUserInvites,
  useGetAllUserInvites,
} from "../../custom-hooks/api";
import { useVirtualizedTableState } from "../../custom-hooks";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";
import { DeleteModalProvider } from "../../context-providers";

const UserInvitesTableStateOptions = {
  defaultSortBy: "role",
  searchIndex: "id",
  searchKeys: ["email", "role"],
};

function UserInvitesSection() {
  const { userInvites, isLoading, getAllUserInvites } = useGetAllUserInvites();
  const { deleteUserInvites, isLoading: isDeleting } = useDeleteUserInvites();
  const {
    processedData: processedUserInvites,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(userInvites, UserInvitesTableStateOptions);
  const tableRef = useRef<Table>(null);

  useEffect(() => {
    getAllUserInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        New Pending Users{" "}
        <Popup
          content="Refresh"
          trigger={<Icon name="refresh" link onClick={getAllUserInvites} />}
          position="top center"
          on="hover"
        />
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
              <Column dataKey="email" label="Email" width={width * 0.55} />
              <Column dataKey="role" label="Role" width={width * 0.25} />
              <Column
                dataKey="email"
                label="Actions"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.2}
                disableSort={true}
                headerRenderer={DefaultHeaderRenderer}
                cellRenderer={({ cellData }) => (
                  <DeleteModalProvider
                    isDeleting={isDeleting}
                    onDelete={() =>
                      deleteUserInvites([cellData], getAllUserInvites)
                    }
                    deleteTitle="Delete Pending User"
                    deleteDescription={`Are you sure you want to delete pending user (${cellData})?`}
                  >
                    <PopUpActionsWrapper actionButtons={[<DeleteButton />]}>
                      <Button icon="ellipsis horizontal" compact />
                    </PopUpActionsWrapper>
                  </DeleteModalProvider>
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
