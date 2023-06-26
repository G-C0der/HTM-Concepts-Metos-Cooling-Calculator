import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

interface FadeAlertProps {
  severity: 'info' | 'success' | 'error' | 'warning';
  message: string | React.ReactNode;
  condition?: boolean;
  resetCondition: () => void;
}

function FadeAlert({ severity, message, condition, resetCondition }: FadeAlertProps) {
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (condition) {
      timer = setTimeout(() => {
        resetCondition();
      }, 10000);
    }

    return () =>  {
      if (timer) clearTimeout(timer); // This function will run if the component unmounts before the timer ends
    }
  }, [condition]);

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
  FadeAlert
};
