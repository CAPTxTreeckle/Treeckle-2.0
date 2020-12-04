import React, { useEffect } from "react";
import { Popup, Icon, Segment } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import DeleteButton from "../delete-button";
import PlaceholderWrapper from "../placeholder-wrapper";
import DefaultHeaderRenderer from "../default-header-renderer";
import "./user-invites-section.scss";
import {
  useDeleteUserInvites,
  useGetAllUserInvites,
} from "../../custom-hooks/api";
import { useUserInvitesTableState } from "../../custom-hooks";

function UserInvitesSection() {
  const { userInvites, isLoading, getAllUserInvites } = useGetAllUserInvites();
  const { deleteUserInvites } = useDeleteUserInvites();
  const {
    tableRef,
    sortedUserInvites,
    sortBy,
    sortDirection,
    sort,
  } = useUserInvitesTableState(userInvites);

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
      <Segment className="virtualized-table-wrapper user-invites-table" raised>
        <AutoSizer onResize={() => tableRef.current?.recomputeRowHeights()}>
          {({ width, height }) => (
            <Table
              ref={tableRef}
              height={height}
              width={width}
              headerHeight={height * 0.1}
              rowGetter={({ index }) => sortedUserInvites[index]}
              rowHeight={height * 0.1}
              rowCount={isLoading ? 0 : sortedUserInvites.length}
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
              sort={sort}
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
                  <DeleteButton
                    deleteTitle={`Delete Pending User`}
                    deleteDescription={`Are you sure you want to delete pending user (${cellData})?`}
                    onDelete={() =>
                      deleteUserInvites([cellData], getAllUserInvites)
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

export default UserInvitesSection;
