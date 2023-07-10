import React from 'react';
import './style.css';
import {Dialog, DialogContent, Button, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';

interface SettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SettingsModal = ({ isOpen, setIsOpen }: SettingsModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{ className: 'settings-dialog-paper' }}
    >
      <DialogContent>
        <Typography>Settings</Typography>

        <Button
          fullWidth
          startIcon={<EditIcon />}
          onClick={() => {}}
        >
          Edit Profile
        </Button>

        <Button
          fullWidth
          startIcon={<LockResetIcon />}
          onClick={() => {}}
        >
          Reset Password
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export {
  SettingsModal
};