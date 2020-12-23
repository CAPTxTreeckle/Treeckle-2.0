import React, { useCallback, useContext } from "react";
import {
  Button,
  ModalContent,
  Popup,
  Progress,
  Segment,
} from "semantic-ui-react";
import {
  BookingCreationContext,
  BookingCreationProvider,
  GlobalModalContext,
} from "../../context-providers";
import {
  BookingCreationStep,
  bookingCreationStepComponents,
  bookingCreationStepHeaders,
} from "../../context-providers/booking-creation-provider";
import "./booking-creation-section.scss";

const BookingCreationLayout = () => {
  const { currentCreationStep, selectedVenue } = useContext(
    BookingCreationContext,
  );
  const { setModalOpen, setModalProps } = useContext(GlobalModalContext);

  const onClickHelp = useCallback(() => {
    const { name: venueName, icName, icEmail, icContactNumber } = {
      ...selectedVenue?.venueFormProps,
    };

    const helpInfo = (
      <>
        {icName || icEmail || icContactNumber ? (
          <>
            {icName && (
              <p>
                <strong>Name:</strong> {icName}
              </p>
            )}
            {icEmail && (
              <p>
                <strong>Email:</strong>{" "}
                <a className="email-link" href={`mailto:${icEmail}`}>
                  {icEmail}
                </a>
              </p>
            )}
            {icContactNumber && (
              <p>
                <strong>Contact Number:</strong> {icContactNumber}
              </p>
            )}
          </>
        ) : (
          <p>
            <strong>Email:</strong>{" "}
            <a className="email-link" href="mailto:treeckle@googlegroups.com">
              treeckle@googlegroups.com
            </a>
          </p>
        )}
      </>
    );

    setModalProps({
      header: `${venueName} Help Info`,
      content: (
        <ModalContent>
          <h3>For any queries, do contact:</h3>
          {helpInfo}
        </ModalContent>
      ),
    });
    setModalOpen(true);
  }, [selectedVenue, setModalOpen, setModalProps]);

  return (
    <Segment.Group raised className="booking-creation-section">
      <Segment>
        <h2 className="section-title-container">
          <div>{bookingCreationStepHeaders[currentCreationStep]}</div>
          {selectedVenue && (
            <div className="section-title-action-container">
              <Popup
                trigger={
                  <Button
                    icon="help"
                    color="black"
                    circular
                    compact
                    onClick={onClickHelp}
                  />
                }
                position="top center"
                content="Help"
              />
            </div>
          )}
        </h2>
      </Segment>
      <Segment className="progress-bar-container">
        <Progress
          className="progress-bar"
          size="small"
          indicating
          percent={
            (currentCreationStep / (BookingCreationStep.__length - 1)) * 100
          }
        />
      </Segment>

      {bookingCreationStepComponents[currentCreationStep]}
    </Segment.Group>
  );
};

function BookingCreationSection() {
  return (
    <BookingCreationProvider>
      <BookingCreationLayout />
    </BookingCreationProvider>
  );
}

export default BookingCreationSection;
