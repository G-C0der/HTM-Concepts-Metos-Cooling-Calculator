import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import { v4 as uuid } from 'uuid';

interface TempAlertProps {
  severity: 'info' | 'success' | 'error' | 'warning';
  message: string | React.ReactNode;
  condition?: boolean;
  resetCondition: () => void;
  duration?: number;
}

function TempAlert({ severity, message, condition, resetCondition, duration = 10000 }: TempAlertProps) {
  const id = uuid();
  const isError = severity === 'error';

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (condition && !isError) {
      timer = setTimeout(() => {
        resetCondition();
      }, duration);
    }

    return () =>  {
      if (timer) clearTimeout(timer);
    }
  }, [condition, id]);

  return (
    <>
      {
        condition &&
        <Snackbar open={condition}>
          <Alert
            elevation={6}
            variant='filled'
            severity={severity}
            onClose={() => resetCondition()}
          >
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
