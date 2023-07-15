import React from 'react';
import {ApiError} from "../../types";
import {Alert, Typography} from "@mui/material";
import {mapMessageKeyword} from "../../utils";

interface ErrorAlertProps {
  error?: ApiError;
  spaceAbove?: boolean;
  spaceBelow?: boolean;
  big?: boolean;
}

const ErrorAlert = ({ error, spaceAbove, spaceBelow, big }: ErrorAlertProps) => {
  if (!error) return null;

  let errorMessage = error.modifiedMessage ?? error.message;
  if (typeof errorMessage === 'string') errorMessage = mapMessageKeyword(errorMessage);

  return (
    <Alert severity={error.severity} sx={{ mt: (spaceAbove ? 2 : 0), mb: (spaceBelow ? 2 : 0) }}>
      {
        big ? (
          <Typography variant='body1'>{errorMessage}</Typography>
        ) : (
          <>{errorMessage}</>
        )
      }
    </Alert>
  );
};

export {
  ErrorAlert
};