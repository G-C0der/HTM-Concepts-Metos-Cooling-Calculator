import React from 'react';
import {ApiError} from "../../types";
import {Alert, Typography} from "@mui/material";
import {Message} from "../Message";

interface ErrorAlertProps {
  error?: ApiError;
  spaceAbove?: boolean;
  spaceBelow?: boolean;
  big?: boolean;
}

const ErrorAlert = ({ error, spaceAbove, spaceBelow, big }: ErrorAlertProps) => {
  return (
    <>
      {
        error &&
        <Alert severity={error.severity} sx={{ mt: (spaceAbove ? 2 : 0), mb: (spaceBelow ? 2 : 0) }}>
          {
            big ? (
              <Typography variant='body1'>{error.modifiedMessage ?? <Message message={error.message} />}</Typography>
            ) : (
              <>{error.modifiedMessage ?? <Message message={error.message} />}</>
            )
          }
        </Alert>
      }
    </>
  );
};

export {
  ErrorAlert
};