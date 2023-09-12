import React, {useEffect, useState} from 'react';
import './style.css';
import {Dialog, DialogContent, Button, Typography, Box, IconButton, Stack} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {PasswordResetForm} from "../PasswordResetForm";
import {ApiDataUserFormEdit, ApiResponse} from "../../types";
import {UserEditForm} from "../UserEditForm";
const packageJson = require('../../../package.json');

interface SettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  apiResponse?: ApiResponse<unknown>;
  setApiResponse: (apiResponse: ApiResponse<never | ApiDataUserFormEdit> | undefined) => void;
  successMessage: string;
  setSuccessMessage: (successMessage: string) => void;
}

type PendingAction = 'editProfile' | 'resetPassword';

const SettingsModal = ({
  isOpen,
  setIsOpen,
  apiResponse,
  setApiResponse,
  successMessage,
  setSuccessMessage
}: SettingsModalProps) => {
  const [pendingAction, setPendingAction] = useState<PendingAction>();

  const actionTitleMap: Record<PendingAction, string> = {
    editProfile: 'Profile Edit',
    resetPassword: 'Password Reset'
  };

  useEffect(() => {
    if (!isOpen || apiResponse?.success) setPendingAction(undefined);
  }, [isOpen, apiResponse]);

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
              <Typography variant="h5" align="center" component='h1' gutterBottom mb={4}>
                Settings
              </Typography>

              <Stack spacing={1.5}>
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
              </Stack>
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

              <Typography variant="h5" align="center" component='h1' gutterBottom mb={4}>
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
            <Box mt={-2}> {/*TODO: figure actual problem out. workaround since there is for some reason more space between Typography and PasswordResetForm*/}
              <PasswordResetForm callback={handlePasswordResetClick} />
            </Box>
          )
        }
      </DialogContent>
      {
        !pendingAction && (
          <Typography
            align="center"
            gutterBottom
            sx={{ fontSize: "15px" , padding: "0 15px 10px 15px", color: 'grey' }}
          >
            v{packageJson.version}
          </Typography>
        )
      }
    </Dialog>
  );
};

export {
  SettingsModal
};
