import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import { v4 as uuid } from 'uuid';
import {MessageSeverity} from "../../types";
import {supportContactMessage} from "../../constants";
import { Message } from '../Message';

interface TempAlertProps {
  severity: MessageSeverity
  message: string;
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

  const completeErrorMessage = (message: string) => message.includes('##here##')
    ? message
    : `${message} ${supportContactMessage}`;

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
            {isError ? <Message message={completeErrorMessage(message)} /> : message}
          </Alert>
        </Snackbar>
      }
    </>
  );
}

export {
  TempAlert
};
