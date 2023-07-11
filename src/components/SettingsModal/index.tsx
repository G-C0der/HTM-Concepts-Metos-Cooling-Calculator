import React, {useContext, useEffect, useState} from 'react';
import './style.css';
import {Dialog, DialogContent, Button, Typography, Box, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {PasswordResetForm} from "../PasswordResetForm";
import {UserContext} from "../../contexts";
import {ApiResponse} from "../../types";
import {TempAlert} from "../TempAlert";
import {htmConceptsEmail} from "../../config";
const packageJson = require('../../../package.json');

interface SettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

type PendingAction = 'editProfile' | 'resetPassword';

const SettingsModal = ({ isOpen, setIsOpen }: SettingsModalProps) => {
  const [pendingAction, setPendingAction] = useState<PendingAction>();

  const [passwordResetResponse, setPasswordResetResponse] = useState<ApiResponse>();
  const [profileEditResponse, setProfileEditResponse] = useState<ApiResponse>();

  const [successMessage, setSuccessMessage] = useState('');

  const { resetPassword } = useContext(UserContext);

  const actionTitleMap: Record<PendingAction, string> = {
    editProfile: 'Profile Edit',
    resetPassword: 'Password Reset'
  };

  useEffect(() => {
    if (passwordResetResponse?.success || profileEditResponse?.success) setPendingAction(undefined);
  }, [passwordResetResponse, profileEditResponse]);

  const handlePasswordResetClick = async (password: string) => {
    const passwordResetResponse = await resetPassword(password);
    setPasswordResetResponse(passwordResetResponse);
    if (passwordResetResponse.success) setSuccessMessage(`Password has been updated.`);
  };

  const clearResponses = () => {
    if (passwordResetResponse) setPasswordResetResponse(undefined);
    if (profileEditResponse) setProfileEditResponse(undefined);

    if (successMessage) setSuccessMessage('');
  };

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
            <>
              <IconButton
                  sx={{ position: 'absolute', left: 5, top: 5 }}
                  onClick={() => setPendingAction(undefined)}
              >
                <ArrowBackIcon />
              </IconButton>

              <Typography variant="h5" align="center" component='h1' gutterBottom>
                {actionTitleMap[pendingAction]}
              </Typography>
            </>
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
            <PasswordResetForm passwordResetCallback={handlePasswordResetClick} />
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

      {
        <TempAlert
          severity='success'
          message={successMessage}
          condition={passwordResetResponse?.success}
          resetCondition={clearResponses}
        />
      }
      {
        passwordResetResponse?.error &&
        <TempAlert
          severity={passwordResetResponse.error.severity}
          message={<>{passwordResetResponse.error.message} If you need support you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.</>}
          condition={passwordResetResponse.success === false}
          resetCondition={clearResponses}
        />
      }
    </Dialog>
  );
};

export {
  SettingsModal
};
