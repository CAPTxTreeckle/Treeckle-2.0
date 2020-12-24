import { useContext, useEffect, useMemo } from "react";
import { AutoSizer, Column, Table } from "react-virtualized";
import { Button, Label, Popup, Segment } from "semantic-ui-react";
import {
  CREATED_AT,
  CREATED_AT_STRING,
  END_DATE_TIME,
  END_DATE_TIME_STRING,
  ID,
  START_DATE_TIME,
  START_DATE_TIME_STRING,
  STATUS,
  VENUE_NAME,
} from "../../constants";
import { BookingsContext } from "../../context-providers";
import { useVirtualizedTableState } from "../../custom-hooks";
import { VirtualizedTableStateOptions } from "../../custom-hooks/use-virtualized-table-state";
import {
  BookingViewProps,
  BookingStatus,
  BookingStatusDetails,
} from "../../types/bookings";
import { displayDateTime } from "../../utils/parser-utils";
import PlaceholderWrapper from "../placeholder-wrapper";
import SearchBar from "../search-bar";
import BookingTableActionsCellRenderer from "../booking-table-actions-cell-renderer";

const bookingUserTableStateOptions: VirtualizedTableStateOptions = {
  defaultSortBy: CREATED_AT,
  defaultSortDirection: "DESC",
  searchIndex: ID,
  searchKeys: [
    VENUE_NAME,
    START_DATE_TIME_STRING,
    END_DATE_TIME_STRING,
    CREATED_AT_STRING,
    STATUS,
  ],
};

type BookingUserDisplayProps = BookingViewProps & {
  [START_DATE_TIME_STRING]: string;
  [END_DATE_TIME_STRING]: string;
  [CREATED_AT_STRING]: string;
};

function BookingUserTable() {
  const { bookings, getBookings, isLoading } = useContext(BookingsContext);

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const bookingUserDisplayData: BookingUserDisplayProps[] = useMemo(
    () =>
      bookings.map((booking) => ({
        ...booking,
        [START_DATE_TIME_STRING]: displayDateTime(booking.startDateTime),
        [END_DATE_TIME_STRING]: displayDateTime(booking.endDateTime),
        [CREATED_AT_STRING]: displayDateTime(booking.createdAt),
      })),
    [bookings],
  );

  const {
    processedData: processedBookings,
    sortBy,
    sortDirection,
    setSortParams,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(
    bookingUserDisplayData,
    bookingUserTableStateOptions,
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
              <Button icon="redo" color="blue" onClick={() => getBookings()} />
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
              rowGetter={({ index }) => processedBookings[index]}
              rowHeight={height * 0.15}
              rowCount={isLoading ? 0 : processedBookings.length}
              overscanRowCount={20}
              noRowsRenderer={() => (
                <PlaceholderWrapper
                  showDefaultMessage
                  defaultMessage="You currently do not have any bookings"
                  placeholder
                  isLoading={isLoading}
                  loadingMessage="Retrieving booking requests"
                />
              )}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={setSortParams}
            >
              <Column dataKey={VENUE_NAME} label="Venue" width={width * 0.2} />
              <Column
                dataKey={START_DATE_TIME}
                label="Start"
                width={width * 0.175}
                cellRenderer={({ cellData, rowData }) =>
                  rowData?.[START_DATE_TIME_STRING] ?? cellData
                }
              />
              <Column
                dataKey={END_DATE_TIME}
                label="End"
                width={width * 0.175}
                cellRenderer={({ cellData, rowData }) =>
                  rowData?.[END_DATE_TIME_STRING] ?? cellData
                }
              />
              <Column
                dataKey={CREATED_AT}
                label="Created at"
                width={width * 0.175}
                cellRenderer={({ cellData, rowData }) =>
                  rowData?.[CREATED_AT_STRING] ?? cellData
                }
              />
              <Column
                dataKey={STATUS}
                label="Status"
                maxWidth={100}
                width={width * 0.175}
                cellRenderer={({ cellData }) => {
                  const status = cellData as BookingStatus;
                  return (
                    <Label
                      color={BookingStatusDetails.get(status)?.color}
                      className="full-width capitalize-text no-side-padding"
                      content={status.toLowerCase()}
                    />
                  );
                }}
                className="center-text"
                headerClassName="center-text"
              />
              <Column
                dataKey={ID}
                label="Actions"
                headerClassName="center-text"
                className="center-text"
                width={width * 0.1}
                disableSort
                cellRenderer={({ rowData }) => (
                  <BookingTableActionsCellRenderer rowData={rowData} />
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </Segment>
    </Segment.Group>
  );
}

export default BookingUserTable;
