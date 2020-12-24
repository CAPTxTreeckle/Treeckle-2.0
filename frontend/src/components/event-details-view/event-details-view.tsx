import { useContext } from "react";
import { Grid, Icon, Image, Label } from "semantic-ui-react";
import defaultEventPoster from "../../assets/default-event-poster.png";
import { displayDateTime } from "../../utils/parser-utils";
import { SingleEventContext } from "../../context-providers";
import EventSignUpButton from "../event-sign-up-button";
import TextViewer from "../text-viewer";
import "./event-details-view.scss";

function EventDetailsView() {
  const { event } = useContext(SingleEventContext);
  const {
    image,
    title,
    organizedBy,
    categories,
    description,
    capacity,
    startDateTime,
    endDateTime,
    venueName,
  } = { ...event?.eventFormProps };

  return (
    <Grid
      className="event-details-view"
      columns="2"
      stackable
      padded="vertically"
      relaxed
    >
      <Grid.Column width="7">
        <Image
          src={image || defaultEventPoster}
          fluid
          alt="Event"
          rounded
          centered
        />
        <div className="sign-up-button-container">
          <EventSignUpButton />
        </div>
      </Grid.Column>
      <Grid.Column width="9">
        {title && <h1 className="title">{title}</h1>}

        {organizedBy && (
          <p>
            <Icon name="user circle" /> <strong>Organised by:</strong>{" "}
            {organizedBy}
          </p>
        )}

        {capacity && (
          <p>
            <Icon name="users" /> <strong>Estimated capacity:</strong>{" "}
            {capacity}
          </p>
        )}

        {venueName && (
          <p>
            <Icon name="point" /> <strong>Venue:</strong> {venueName}
          </p>
        )}

        {startDateTime && (
          <p>
            <Icon name="calendar" /> <strong>Start:</strong>{" "}
            {displayDateTime(startDateTime)}
          </p>
        )}

        {endDateTime && (
          <p>
            <Icon name="calendar" /> <strong>End:</strong>{" "}
            {displayDateTime(endDateTime)}
          </p>
        )}

        {categories && categories.length > 0 && (
          <div className="categories">
            <div className="categories-label">
              <Icon name="tags" /> <strong>Event categories:</strong>
            </div>

            <Label.Group>
              {categories.map((category: string) => (
                <Label key={category} content={category} />
              ))}
            </Label.Group>
          </div>
        )}

        {description && <TextViewer>{description}</TextViewer>}
      </Grid.Column>
    </Grid>
  );
}

export default EventDetailsView;
