import React, {useState} from 'react';
import './style.css';
import {Dialog, DialogContent, Button, Typography, Box, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {PasswordResetForm} from "../PasswordResetForm";
const packageJson = require('../../../package.json');

interface SettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

type PendingAction = 'editProfile' | 'resetPassword';

const SettingsModal = ({ isOpen, setIsOpen }: SettingsModalProps) => {
  const [pendingAction, setPendingAction] = useState<PendingAction>();

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{ className: 'settings-dialog-paper' }}
    >
      <DialogContent>
        <IconButton
          sx={{ position: 'absolute', right: 5, top: 5 }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>

        {
          pendingAction && (
            <IconButton
              sx={{ position: 'absolute', left: 5, top: 5 }}
              onClick={() => setPendingAction(undefined)}
            >
              <ArrowBackIcon />
            </IconButton>
          )
        }

        {
          !pendingAction && (
            <>
              <Typography variant="h5" align="center" component='h1' gutterBottom>
                Settings
              </Typography>

              <Button
                fullWidth
                sx={{ justifyContent: 'flex-start', textTransform: 'none', paddingLeft: '26px' }}
                onClick={() => setPendingAction('editProfile')}
              >
                <EditIcon />
                <Box sx={{ ml: 1 }}>Edit Profile</Box>
              </Button>

              <Button
                fullWidth
                sx={{ justifyContent: 'flex-start', textTransform: 'none', paddingLeft: '26px' }}
                onClick={() => setPendingAction('resetPassword')}
              >
                <LockResetIcon />
                <Box sx={{ ml: 1 }}>Reset Password</Box>
              </Button>
            </>
          )
        }
        {
          pendingAction === 'editProfile' && (
            <></>
          )
        }
        {
          pendingAction === 'resetPassword' && (
            <PasswordResetForm passwordResetCallback={async () => {}} />
          )
        }
      </DialogContent>

      <Typography
        align="center"
        gutterBottom
        sx={{ fontSize: "15px" , padding: "0 15px 10px 15px", color: 'grey' }}
      >
        v{packageJson.version}
      </Typography>
    </Dialog>
  );
};

export {
  SettingsModal
};
