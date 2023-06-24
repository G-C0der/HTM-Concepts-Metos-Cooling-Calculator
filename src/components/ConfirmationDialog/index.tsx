import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

interface ConfirmationDialogProps {
  text: string;
  pendingAction: () => unknown;
  isOpen: boolean;
  setIsOpen: (isDialogOpen: boolean) => void;
}

const ConfirmationDialog = ({ text, pendingAction, isOpen, setIsOpen }: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <DialogTitle>
        Confirm Action
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            pendingAction();
            setIsOpen(false);
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export {
  ConfirmationDialog
};