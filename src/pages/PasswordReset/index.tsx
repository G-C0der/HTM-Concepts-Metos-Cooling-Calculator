import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {UserContext} from "../../contexts";
import {Alert, Box, CircularProgress, Grid, Paper, Typography} from "@mui/material";
import {PasswordResetForm} from "../../components/PasswordResetForm";
import {supportContactMessage, urlExpiredError} from "../../constants";
import {ApiError, ApiResponse} from "../../types";
import {ErrorAlert} from "../../components/ErrorAlert";
import {doesMessageContainKeyword} from "../../utils";

type Status = 'tokenVerificationLoading' | 'tokenVerificationSuccess' | 'tokenVerificationError' |
  'passwordResetSuccess' | 'passwordResetError';

const specificIncompleteErrors = {
  resetPasswordUrlExpired: urlExpiredError
};

const ResetPassword = () => {
  const [status, setStatus] = useState<Status>('tokenVerificationLoading');
  const [tokenVerificationError, setTokenVerificationError] = useState<ApiError>();
  const [passwordResetError, setPasswordResetError] = useState<ApiError>();

  const { token } = useParams();

  const { verifyResetPasswordToken } = useContext(UserContext);

  useEffect(() => {
    const verifyResetUserPasswordToken = async () => {
      const verifyResetPasswordResponse = await verifyResetPasswordToken(token!);

      if (verifyResetPasswordResponse.success) setStatus('tokenVerificationSuccess');
      else {
        setStatus('tokenVerificationError');
        setTokenVerificationError(setModifiedErrorMessage(verifyResetPasswordResponse.error!)!);
      }
    };

    verifyResetUserPasswordToken();
  }, [token]);

  const setModifiedErrorMessage = (error: ApiError) => {
    error.modifiedMessage = `${error.message}
      ${(error.message === specificIncompleteErrors.resetPasswordUrlExpired) 
        ? 'To send a new password reset email, return to the login page.'
        : ''}
      ${!doesMessageContainKeyword(error.message, 'here') 
        ? supportContactMessage 
        : ''}`;
    
    return error;
  };

  const handlePasswordResetClick = (passwordResetResponse: ApiResponse) => {
    if (passwordResetResponse.success) setStatus('passwordResetSuccess');
    else {
      setStatus('passwordResetError');
      setPasswordResetError(setModifiedErrorMessage(passwordResetResponse.error!)!);
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Typography variant="h5" align="center" component="h1" gutterBottom sx={{ mb: 8 }}>
            Password Reset
          </Typography>

          {
            status === 'tokenVerificationLoading' &&
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 8 }}>
              <CircularProgress />
            </Box>
          }
          {
            (status === 'tokenVerificationSuccess' || status === 'passwordResetError') &&
            <PasswordResetForm token={token} callback={handlePasswordResetClick} error={passwordResetError} />
          }
          {
            status === 'passwordResetSuccess' &&
            <>
              <Alert severity="success" sx={{ mb: 1 }}>
                Your password has been reset successfully.
              </Alert>
            </>
          }
          {
            status === 'tokenVerificationError' &&
            <ErrorAlert error={tokenVerificationError} big />
          }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;