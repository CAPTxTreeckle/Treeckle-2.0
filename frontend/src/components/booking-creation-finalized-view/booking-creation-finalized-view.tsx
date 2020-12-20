import React, { useContext } from "react";
import { Segment, Button } from "semantic-ui-react";
import { BookingCreationContext } from "../../context-providers";

function BookingCreationFinalizedView() {
  const { goToNextStep, goToPreviousStep } = useContext(BookingCreationContext);

  return (
    <>
      <Segment />

      <Segment secondary>
        <div className="action-container justify-end">
          <Button color="black" content="Back" onClick={goToPreviousStep} />
          <Button color="blue" content="Submit" onClick={goToNextStep} />
        </div>
      </Segment>
    </>
  );
}

export default BookingCreationFinalizedView;
