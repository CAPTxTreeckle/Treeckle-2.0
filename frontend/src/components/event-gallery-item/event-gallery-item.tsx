import React, { useContext } from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import defaultEventPoster from "../../assets/default-event-poster.png";
import { displayDatetime } from "../../utils/parser-utils";
import "./event-gallery-item.scss";
import EventSignUpButton from "../event-sign-up-button";
import { SingleEventContext } from "../../context-providers";

function EventGalleryItem() {
  const { event } = useContext(SingleEventContext);
  const {
    image,
    eventTitle,
    organisedBy,
    startDateTime,
    endDateTime,
    venueName,
  } = event?.eventFormProps ?? {};

  return (
    <Card id="event-gallery-item" raised fluid>
      <Image src={image || defaultEventPoster} alt="Event" wrapped ui={false} />

      <Card.Content className="flex-no-grow">
        {eventTitle && <Card.Header>{eventTitle}</Card.Header>}
        {organisedBy && (
          <Card.Meta>
            <strong>Organised by:</strong> {organisedBy}
          </Card.Meta>
        )}
      </Card.Content>

      <Card.Content className="event-info-container flex-grow">
        <div className="event-info">
          {venueName && (
            <p>
              <Icon name="point" /> <strong>Venue:</strong> {venueName}
            </p>
          )}

          {startDateTime && (
            <p>
              <Icon name="calendar" /> <strong>Start:</strong>{" "}
              {displayDatetime(startDateTime)}
            </p>
          )}
          {endDateTime && (
            <p>
              <Icon name="calendar" /> <strong>End:</strong>{" "}
              {displayDatetime(endDateTime)}
            </p>
          )}
        </div>

        <div className="sign-up-button-container">
          <EventSignUpButton />
        </div>
      </Card.Content>
    </Card>
  );
}

export default EventGalleryItem;
