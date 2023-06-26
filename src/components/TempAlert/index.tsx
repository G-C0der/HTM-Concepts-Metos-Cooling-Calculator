import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

interface TempAlertProps {
  severity: 'info' | 'success' | 'error' | 'warning';
  message: string | React.ReactNode;
  condition?: boolean;
  resetCondition: () => void;
  duration?: number;
}

function TempAlert({ severity, message, condition, resetCondition, duration = 10000 }: TempAlertProps) {
  const isError = severity === 'error';

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (condition) {
      timer = setTimeout(() => {
        resetCondition();
      }, duration);
    }

    return () =>  {
      if (timer) clearTimeout(timer); // This function will run if the component unmounts before the timer ends
    }
  }, [condition, message, severity]);

  return (
    <>
      {
        condition &&
        <Snackbar open={condition}>
          <Alert elevation={6} variant='filled' severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      }
    </>
  );
}

export {
  TempAlert
};
