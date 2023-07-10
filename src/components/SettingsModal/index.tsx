import React from 'react';
import './style.css';
import {Dialog, DialogContent, Button, Typography, Box} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
const packageJson = require('../../../package.json');

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
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <Box>
          <Typography variant="h5" align="center" component='h1' gutterBottom>
            Settings
          </Typography>

          <Button
            fullWidth
            sx={{ justifyContent: 'flex-start', textTransform: 'none', paddingLeft: '26px' }}
            onClick={() => {}}
          >
            <EditIcon />
            <Box sx={{ ml: 1 }}>Edit Profile</Box>
          </Button>

          <Button
            fullWidth
            sx={{ justifyContent: 'flex-start', textTransform: 'none', paddingLeft: '26px' }}
            onClick={() => {}}
          >
            <LockResetIcon />
            <Box sx={{ ml: 1 }}>Reset Password</Box>
          </Button>
        </Box>

        <Typography
          align="center"
          gutterBottom
          sx={{ fontSize: "15px" , padding: "0 15px 10px 15px", color: 'grey' }}
        >
          v{packageJson.version}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export {
  SettingsModal
};
