import React, { useContext } from "react";
import { Button, Segment } from "semantic-ui-react";
import { BookingCreationContext } from "../../context-providers";

function BookingCreationCustomForm() {
  const { goToNextStep, goToPreviousStep } = useContext(BookingCreationContext);

  return (
    <>
      <Segment />

      <Segment secondary>
        <div className="action-container justify-end">
          <Button color="black" content="Back" onClick={goToPreviousStep} />
          <Button color="blue" content="Next" onClick={goToNextStep} />
        </div>
      </Segment>
    </>
  );
}

export default BookingCreationCustomForm;
