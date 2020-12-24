import { useContext, useEffect, useMemo } from "react";
import { Popup, Segment, Button } from "semantic-ui-react";
import { AutoSizer, Table, Column } from "react-virtualized";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import { useVirtualizedTableState } from "../../custom-hooks";
import { VirtualizedTableStateOptions } from "../../custom-hooks/use-virtualized-table-state";
import { displayDateTime } from "../../utils/parser-utils";
import {
  CREATED_AT,
  CREATED_AT_STRING,
  EMAIL,
  ID,
  NAME,
} from "../../constants";
import { OrganizationListenerViewProps } from "../../types/organizations";
import {
  BookingNotificationSubscriptionContext,
  DeleteModalProvider,
} from "../../context-providers";
import DeleteModalButton from "../delete-modal-button";
import BookingNotificationSubscriptionForm from "../booking-notification-subscription-form";

const bookingNotificationSubscriptionTableStateOptions: VirtualizedTableStateOptions = {
  defaultSortBy: CREATED_AT,
  defaultSortDirection: "DESC",
  searchIndex: ID,
  searchKeys: [NAME, EMAIL, CREATED_AT_STRING],
};

type bookingNotificationSubscribersDisplayProps = OrganizationListenerViewProps & {
  [CREATED_AT_STRING]: string;
};

function BookingNotificationSubscriptionTable() {
  const {
    bookingNotificationSubscribers,
    getBookingNotificationSubscribers,
    deleteBookingNotificationSubscribers,
    isLoading,
  } = useContext(BookingNotificationSubscriptionContext);

  const subscribers: bookingNotificationSubscribersDisplayProps[] = useMemo(
    () =>
      bookingNotificationSubscribers.map((subscribers) => ({
        ...subscribers,
        [CREATED_AT_STRING]: displayDateTime(subscribers.createdAt),
      })),
    [bookingNotificationSubscribers],
  );

  useEffect(() => {
    getBookingNotificationSubscribers();
  }, [getBookingNotificationSubscribers]);

  const {
    processedData: processedSubscribers,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(
    subscribers,
    bookingNotificationSubscriptionTableStateOptions,
  );

  return (
    <Segment.Group>
      <Segment>
        <BookingNotificationSubscriptionForm />
      </Segment>

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
                icon="redo"
                color="blue"
                onClick={getBookingNotificationSubscribers}
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
              rowGetter={({ index }) => processedSubscribers[index]}
              rowHeight={height * 0.1}
              rowCount={isLoading ? 0 : processedSubscribers.length}
              overscanRowCount={20}
              noRowsRenderer={() => (
                <PlaceholderWrapper
                  showDefaultMessage
                  defaultMessage="No subscribers"
                  placeholder
                  isLoading={isLoading}
                  loadingMessage="Retrieving subscribers"
                />
              )}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={setSortParams}
            >
              <Column dataKey={NAME} label="Name" width={width * 0.25} />
              <Column dataKey={EMAIL} label="Email" width={width * 0.35} />
              <Column
                dataKey={CREATED_AT}
                label="Added at"
                width={width * 0.25}
                cellRenderer={({ cellData, rowData }) =>
                  rowData?.[CREATED_AT_STRING] ?? cellData
                }
              />
              <Column
                dataKey={ID}
                label="Action"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.15}
                disableSort
                cellRenderer={({ rowData }) => {
                  const {
                    id,
                    email,
                  } = rowData as OrganizationListenerViewProps;

                  return (
                    <DeleteModalProvider
                      onDelete={() =>
                        deleteBookingNotificationSubscribers([id])
                      }
                      deleteTitle="Remove Bookings Notification Subscriber"
                      deleteDescription={`Are you sure you want to remove subscriber (${email})?`}
                    >
                      <DeleteModalButton
                        compact
                        popUpContent="Remove"
                        icon="times"
                      />
                    </DeleteModalProvider>
                  );
                }}
              />
            </Table>
          )}
        </AutoSizer>
      </Segment>
    </Segment.Group>
  );
}

export default BookingNotificationSubscriptionTable;
