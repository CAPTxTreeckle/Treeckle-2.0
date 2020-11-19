import React from "react";
import { Button } from "semantic-ui-react";

interface Props {
  className: string;
  onClick: () => void;
}

function CreateBookingRequestsButton({ className, onClick }: Props) {
  return (
    <Button color="teal" className={className} onClick={onClick}>
      Create
    </Button>
  );
}

export default CreateBookingRequestsButton;
