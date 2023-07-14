import React, {useContext, useEffect, useState} from 'react';
import {CircularProgress, Paper, Typography, Alert, Box} from '@mui/material';
import { Grid } from "@mui/material";
import {useParams} from "react-router-dom";
import {UserContext} from "../../contexts";
import {htmConceptsEmail} from "../../config";
import {SendEmailForm} from "../../components/SendEmailForm";
import {ApiError, ApiResponse} from "../../types";
import {urlExpiredError, checkSpamFolderMessage} from "../../constants";
import {TempAlert} from "../../components/TempAlert";
import {ErrorAlert} from "../../components/ErrorAlert";

const specificIncompleteErrors = {
  verificationUrlExpired: urlExpiredError
};

const Verification = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<ApiError>();
  const [showResendForm, setShowResendForm] = useState(false);
  const [sendEmailResponse, setSendEmailResponse] = useState<ApiResponse | null>(null);

  const { token } = useParams();

  const { verify, sendVerificationEmail } = useContext(UserContext);

  useEffect(() => {
    const verifyUser = async () => {
      const verifyResponse = await verify(token!);

      if (verifyResponse.success) setStatus('success');
      else {
        setStatus('error');
        setError(setModifiedErrorMessage(verifyResponse.error!)!);
      }
    };

    verifyUser();
  }, [token]);

  const setModifiedErrorMessage = (error: ApiError) => {
    if (!Object.values(specificIncompleteErrors).includes(error.message)) {
      error.modifiedMessage = (
        <>{error.message} If you need support, you can contact us <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>.</>
      );
    }

    if (error.message === specificIncompleteErrors.verificationUrlExpired) {
      setShowResendForm(true);

      error.modifiedMessage = (
        <>
          {error.message}
          To send a new verification email, enter the email associated with your account and click the button
          below.<br/>
        </>
      );
    }

    return error;
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Typography variant="h5" align="center" component="h1" gutterBottom sx={{ mb: 8 }}>
            Account Verification
          </Typography>

          {
            status === 'loading' &&
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 8 }}>
              <CircularProgress />
            </Box>
          }
          {
            status === 'success' &&
            <>
              <Alert severity="success" sx={{ mb: 1 }}>
                Your account has been verified successfully.
              </Alert>
              <Alert severity="info">
                Please note that your user account is currently inactive.
                We will review the provided data and email you, once your user account has been activated.
                We aim to complete the activation as soon as possible. If you do not receive an email from us or have any
                questions, you can contact us <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>.
              </Alert>
            </>
          }
          {
            status === 'error' &&
            <ErrorAlert error={error} big />
          }
          {
            showResendForm &&
            <SendEmailForm
              callback={sendVerificationEmail}
              setResponse={setSendEmailResponse}
              buttonText='Send Verification Email'
              buttonColor='primary'
            />
          }
          {
            <TempAlert
              severity='success'
              message={`Email has been sent. ${checkSpamFolderMessage}`}
              condition={sendEmailResponse?.success}
              resetCondition={() => setSendEmailResponse(null)}
            />
          }
          {
            sendEmailResponse?.error &&
            <TempAlert
              severity={sendEmailResponse.error.severity}
              message={sendEmailResponse.error.message}
              condition={sendEmailResponse.success === false}
              resetCondition={() => setSendEmailResponse(null)}
            />
          }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Verification;
