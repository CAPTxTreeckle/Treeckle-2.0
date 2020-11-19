import React from "react";
import { CSVReader } from "react-papaparse";
import { Button, Icon } from "semantic-ui-react";

import "./user-invite-form-upload.scss";

interface Props {
  addEmails: (newEmails: string[]) => void;
}

const UserInviteUpload = ({ addEmails }: Props) => {
  const buttonRef = React.createRef<CSVReader>();

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  function handleOnFileLoad(
    csvData: Array<{
      data: Array<string>;
      errors: Array<string>;
    }>,
  ) {
    const filteredData = csvData
      .map((data) => data.data[0])
      .filter((data) => data !== "emails" && data !== "");
    addEmails(filteredData);
  }

  return (
    <CSVReader
      ref={buttonRef}
      onFileLoad={handleOnFileLoad}
      noClick
      noDrag
      noProgressBar
      config={{
        skipEmptyLines: "greedy",
      }}
    >
      {/* eslint no-empty-pattern: 0  */}
      {({}) => (
        <Button className="upload-button-container">
          <Button color="blue" onClick={handleOpenDialog}>
            <Icon name="upload" />
            Upload
          </Button>
        </Button>
      )}
    </CSVReader>
  );
};

export default UserInviteUpload;
