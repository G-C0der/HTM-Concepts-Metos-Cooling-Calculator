import React, {useEffect, useState} from 'react';
import './style.css';
import {Dialog, DialogContent, Button, Typography, Box, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {PasswordResetForm} from "../PasswordResetForm";
import {ApiDataUserFormEdit, ApiResponse} from "../../types";
import {TempAlert} from "../TempAlert";
import {htmConceptsEmail} from "../../config";
import {UserEditForm} from "../UserEditForm";
const packageJson = require('../../../package.json');

interface SettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

type PendingAction = 'editProfile' | 'resetPassword';

const SettingsModal = ({ isOpen, setIsOpen }: SettingsModalProps) => {
  const [pendingAction, setPendingAction] = useState<PendingAction>();

  const [apiResponse, setApiResponse] = useState<ApiResponse<never | ApiDataUserFormEdit>>();

  const [successMessage, setSuccessMessage] = useState('');

  const actionTitleMap: Record<PendingAction, string> = {
    editProfile: 'Profile Edit',
    resetPassword: 'Password Reset'
  };

  useEffect(() => {
    if (apiResponse?.success) setPendingAction(undefined);
  }, [apiResponse]);

  const handlePasswordResetClick = (passwordResetResponse: ApiResponse) => {
    clearResponse();

    setApiResponse(passwordResetResponse);
    if (passwordResetResponse.success) setSuccessMessage('Password has been updated.');
  };

  const handleFetchFormError = (fetchFormErrorResponse: ApiResponse<ApiDataUserFormEdit>) => {
    clearResponse();

    setPendingAction(undefined);

    setApiResponse(fetchFormErrorResponse);
  };

  const handleProfileEditClick = (profileEditResponse: ApiResponse) => {
    clearResponse();

    setApiResponse(profileEditResponse);
    if (profileEditResponse.success) setSuccessMessage('Profile has been updated.');
  };

  const clearResponse = () => {
    if (apiResponse) setApiResponse(undefined);
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
          !pendingAction && (
            <>
              <Typography variant="h5" align="center" component='h1' gutterBottom mb={3}>
                Settings
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                sx={{ justifyContent: 'flex-start', textTransform: 'none', paddingLeft: '26px' }}
                onClick={() => setPendingAction('editProfile')}
              >
                <EditIcon />
                <Box sx={{ ml: 1 }}>Update Profile</Box>
              </Button>

              <Button
                fullWidth
                variant="outlined"
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
          pendingAction && (
            <>
              <IconButton
                sx={{ position: 'absolute', left: 5, top: 5 }}
                onClick={() => setPendingAction(undefined)}
              >
                <ArrowBackIcon />
              </IconButton>

              <Typography variant="h5" align="center" component='h1' gutterBottom mb={3}>
                {actionTitleMap[pendingAction]}
              </Typography>
            </>
          )
        }
        {
          pendingAction === 'editProfile' && (
            <UserEditForm fetchFormErrorCallback={handleFetchFormError} editProfileCallback={handleProfileEditClick} />
          )
        }
        {
          pendingAction === 'resetPassword' && (
            <PasswordResetForm callback={handlePasswordResetClick} />
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
          condition={apiResponse?.success}
          resetCondition={clearResponse}
        />
      }
      {
        apiResponse?.error &&
        <TempAlert
          severity={apiResponse.error.severity}
          message={<>{apiResponse.error.message} If you need support you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.</>}
          condition={apiResponse.success === false}
          resetCondition={clearResponse}
        />
      }
    </Dialog>
  );
};

export {
  SettingsModal
};
