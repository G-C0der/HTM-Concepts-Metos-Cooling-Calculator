import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {UserContext} from "../../contexts";
import {htmConceptsEmail} from "../../config";
import {Alert, Box, CircularProgress, Grid, Paper, Typography} from "@mui/material";
import {PasswordResetForm} from "../../components/PasswordResetForm";
import {urlExpiredError} from "../../constants/error";

type Status = 'tokenVerificationLoading' | 'tokenVerificationSuccess' | 'tokenVerificationError' |
  'passwordResetSuccess' | 'passwordResetError';

const specificIncompleteErrors = {
  resetPasswordUrlExpired: urlExpiredError
};

const ResetPassword = () => {
  const [status, setStatus] = useState<Status>('tokenVerificationLoading');
  const [error, setError] = useState<string | React.ReactNode>('');
  const [passwordResetError, setPasswordResetError] = useState<string | React.ReactNode>('');

  const { token } = useParams();

  const { verifyResetPasswordToken, resetPassword } = useContext(UserContext);

  useEffect(() => {
    const verifyResetUserPasswordToken = async () => {
      const verifyResetPasswordResponse = await verifyResetPasswordToken(token!);

      if (verifyResetPasswordResponse.success) setStatus('tokenVerificationSuccess');
      else {
        setStatus('tokenVerificationError');
        setError(completeError(verifyResetPasswordResponse.error!)!);
      }
    };

    verifyResetUserPasswordToken();
  }, [token]);

  const completeError = (error: string) => (
    <>
      {error}
      {
        (error === specificIncompleteErrors.resetPasswordUrlExpired) &&
        <>To send a new password reset email, return to the login page.<br/></>
      }
      If you need support, you can contact us <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>.
    </>
  );

  const handlePasswordResetClick = async (password: string) => {
    const passwordResetResponse = await resetPassword(token!, password);

    if (passwordResetResponse.success) setStatus('passwordResetSuccess');
    else {
      setStatus('passwordResetError');
      setPasswordResetError(completeError(passwordResetResponse.error!)!);
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
            <PasswordResetForm passwordResetCallback={handlePasswordResetClick} error={passwordResetError} />
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
            <Alert severity="error">
              <Typography variant="body1">
                {error}
              </Typography>
            </Alert>
          }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;