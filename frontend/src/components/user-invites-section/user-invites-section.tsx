import React, { useEffect } from "react";
import { Popup, Icon, Segment } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import DeleteButton from "../delete-button";
import PlaceholderWrapper from "../placeholder-wrapper";
import "./user-invites-section.scss";
import {
  useDeleteUserInvites,
  useGetAllUserInvites,
} from "../../custom-hooks/api";

function UserInvitesSection() {
  const { userInvites, isLoading, getAllUserInvites } = useGetAllUserInvites();
  const { deleteUserInvites } = useDeleteUserInvites();

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
        <AutoSizer>
          {({ width, height }) => (
            <Table
              height={height}
              width={width}
              headerHeight={height * 0.1}
              rowGetter={({ index }) => userInvites[index]}
              rowHeight={height * 0.1}
              rowCount={isLoading ? 0 : userInvites.length}
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
            >
              <Column dataKey="email" label="Email" width={width * 0.55} />
              <Column dataKey="role" label="Role" width={width * 0.25} />
              <Column
                dataKey="email"
                label="Actions"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.2}
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
