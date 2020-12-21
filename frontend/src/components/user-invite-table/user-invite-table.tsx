import React, { useContext, useEffect, useMemo } from "react";
import { Popup, Segment, Button } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";

import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import { useVirtualizedTableState } from "../../custom-hooks";
import { UserInviteData } from "../../types/users";
import UserInviteTableActionsCellRenderer from "../user-invite-table-actions-cell-renderer";
import { VirtualizedTableStateOptions } from "../../custom-hooks/use-virtualized-table-state";
import { displayDateTime } from "../../utils/parser-utils";
import {
  CREATED_AT,
  CREATED_AT_STRING,
  EMAIL,
  ID,
  ROLE,
} from "../../constants";
import { UserInvitesContext } from "../../context-providers";

const UserInvitesTableStateOptions: VirtualizedTableStateOptions = {
  defaultSortBy: CREATED_AT,
  defaultSortDirection: "DESC",
  searchIndex: ID,
  searchKeys: [EMAIL, CREATED_AT_STRING, ROLE],
};

type UserInviteDisplayData = UserInviteData & {
  createdAtString: string;
};

function UserInviteTable() {
  const { userInvites, isLoading, getAllUserInvites } = useContext(
    UserInvitesContext,
  );

  useEffect(() => {
    getAllUserInvites();
  }, [getAllUserInvites]);

  const userInviteDisplayData: UserInviteDisplayData[] = useMemo(
    () =>
      userInvites.map((userInvite) => ({
        ...userInvite,
        createdAtString: displayDateTime(userInvite.createdAt),
      })),
    [userInvites],
  );

  const {
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
              <Button icon="refresh" color="blue" onClick={getAllUserInvites} />
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
                  <UserInviteTableActionsCellRenderer rowData={rowData} />
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </Segment>
    </Segment.Group>
  );
}

export default UserInviteTable;
