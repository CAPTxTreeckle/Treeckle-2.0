import React, { useCallback, useContext } from "react";
import { Popup, Button, Icon } from "semantic-ui-react";
import { saveAs } from "file-saver";
import papaparse from "papaparse";
import FileUploader from "../file-uploader";
import { UserCreationSectionContext } from "../user-creation-section";
import {
  PendingCreationUser,
  Role,
  roles,
  UserCreationStatus,
} from "../../types/users";
import { EMAIL_REGEX } from "../../constants";

const userCreationCsvTemplate = new Blob(
  [
    papaparse.unparse({
      fields: ["email", "role (optional/default to Resident)"],
      data: [
        ["jeremy@example.com", "resident"],
        ["john@example.com", "organizer"],
        ["jenny@example.com", "admin"],
        ["james@another.example.com"],
      ],
    }),
  ],
  { type: "text/csv;charset=utf-8" },
);

const onDownloadCsvTemplate = () =>
  saveAs(userCreationCsvTemplate, "user creation template.csv");

function UserCreationCsvUploader() {
  const { pendingCreationUsers, setPendingCreationUsers } = useContext(
    UserCreationSectionContext,
  );

  const onAcceptCsvFile = useCallback(
    (files: File[]) => {
      const csvFile = files?.[0];

      if (!csvFile) {
        return;
      }

      papaparse.parse(csvFile, {
        worker: true,
        complete: ({ data }) => {
          // removes column headers
          data.shift();

          const pendingCreationEmails = new Set(
            pendingCreationUsers.map(({ email }) => email),
          );

          const newPendingCreationUsers: PendingCreationUser[] = (data as string[][]).map(
            (row) => {
              const email = row?.[0]?.trim().toLowerCase();
              const roleString = row?.[1]?.trim().toUpperCase();
              const role = (roles as string[]).includes(roleString)
                ? (roleString as Role)
                : Role.Resident;

              if (!email) {
                return {
                  email: "<empty>",
                  role,
                  status: UserCreationStatus.Invalid,
                };
              }

              if (!EMAIL_REGEX.test(email)) {
                return { email, role, status: UserCreationStatus.Invalid };
              }

              if (pendingCreationEmails.has(email)) {
                return { email, role, status: UserCreationStatus.Duplicated };
              }

              pendingCreationEmails.add(email);
              return { email, role, status: UserCreationStatus.New };
            },
          );

          const updatedPendingCreationUsers = newPendingCreationUsers.concat(
            pendingCreationUsers,
          );

          setPendingCreationUsers(updatedPendingCreationUsers);
        },
      });
    },
    [pendingCreationUsers, setPendingCreationUsers],
  );

  return (
    <>
      <h2 className="section-title-container black-text flex-no-grow">
        <div className="section-title">CSV Upload</div>

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
