import React, { useContext } from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import defaultEventPoster from "../../assets/default-event-poster.png";
import { displayDatetime } from "../../utils/parser-utils";
import EventSignUpButton from "../event-sign-up-button";
import { SingleEventContext } from "../../context-providers";
import "./event-gallery-card.scss";

function EventGalleryCard() {
  const { event } = useContext(SingleEventContext);
  const { image, title, organizedBy, startDateTime, endDateTime, venueName } = {
    ...event?.eventFormProps,
  };

  return (
    <Card className="event-gallery-card" raised fluid>
      <Image src={image || defaultEventPoster} alt="Event" wrapped ui={false} />

      <Card.Content className="flex-no-grow">
        {title && <Card.Header>{title}</Card.Header>}
        {organizedBy && (
          <Card.Meta>
            <strong>Organised by:</strong> {organizedBy}
          </Card.Meta>
        )}
      </Card.Content>

      <Card.Content className="event-info-container flex-grow vertical-space-margin">
        <div>
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

export default EventGalleryCard;
