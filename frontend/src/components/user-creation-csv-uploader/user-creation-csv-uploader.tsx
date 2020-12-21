import React, { useCallback, useContext } from "react";
import { Popup, Button, Icon } from "semantic-ui-react";
import papaparse from "papaparse";
import { toast } from "react-toastify";
import FileUploader from "../file-uploader";
import { UserCreationContext } from "../../context-providers";
import {
  onDownloadCsvTemplate,
  parseCsvDataToPendingCreationUsers,
} from "./helper";

function UserCreationCsvUploader() {
  const { pendingCreationUsers, setPendingCreationUsers } = useContext(
    UserCreationContext,
  );

  const onAcceptCsvFile = useCallback(
    (files: File[]) => {
      const csvFile = files?.[0];

      if (!csvFile) {
        return;
      }

      papaparse.parse(csvFile, {
        worker: true,
        error: (error) => {
          console.log("Parse CSV file error:", error, error.message);
          toast.error(error.message);
        },
        complete: ({ data }) => {
          // removes column headers
          data.shift();

          const parsedPendingCreationUsers = parseCsvDataToPendingCreationUsers(
            data as string[][],
            pendingCreationUsers,
          );

          const updatedPendingCreationUsers = parsedPendingCreationUsers.concat(
            pendingCreationUsers,
          );

          setPendingCreationUsers(updatedPendingCreationUsers);
          toast.info("The CSV file content has been successfully parsed.");
        },
      });
    },
    [pendingCreationUsers, setPendingCreationUsers],
  );

  return (
    <>
      <h2 className="section-title-container black-text">
        <div>CSV Upload</div>

        <div className="section-title-action-container">
          <Popup
            content="Download user creation CSV template"
            wide
            trigger={
              <Button
                compact
                icon={
                  <Icon>
                    <i className="fas fa-file-csv" />
                  </Icon>
                }
                color="blue"
                onClick={onDownloadCsvTemplate}
              />
            }
            position="top center"
            on="hover"
          />
        </div>
      </h2>

      <FileUploader
        onAcceptFiles={onAcceptCsvFile}
        icon={
          <Icon>
            <i className="fas fa-file-csv" />
          </Icon>
        }
        title="Drag and drop, or click here to upload CSV file."
        accept="text/csv"
      />
    </>
  );
}

export default UserCreationCsvUploader;
