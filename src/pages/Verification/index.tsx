import React, {useContext, useEffect, useState} from 'react';
import {CircularProgress, Paper, Typography, Alert, Box, Button, TextField} from '@mui/material';
import { Grid } from "@mui/material";
import {useParams} from "react-router-dom";
import {UserContext} from "../../contexts";
import {htmConceptsEmail} from "../../config";

const specificIncompleteErrors = {
  verificationLinkExpired: 'Your verification link has expired.'
};

const Verification = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<string | React.ReactNode>('');
  const [email, setEmail] = useState('');

  const { token } = useParams();

  const { verify, sendVerificationEmail } = useContext(UserContext);

  useEffect(() => {
    const verifyUser = async () => {
      const verifyResponse = await verify(token!);

      if (verifyResponse.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(completeError(verifyResponse.error!)!);
      }
    };

    verifyUser();
  }, [token]);

  const completeError = (error: string) => {
    if (!Object.values(specificIncompleteErrors).includes(error)) return (
      <>{error} If you need support, you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.</>
    );

    switch (error) {
      case specificIncompleteErrors.verificationLinkExpired:
        return (
          <>
            {error}
            To send a new verification email, enter the email associated with your account and click the button
            below.<br/>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ mt: 2, mb: 1 }}
            />
            <Button
              style={{backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "5px 10px 5px",
                textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "12px",
                margin: "30px 0 0 15px", cursor: "pointer"}}
              onClick={async () => await sendVerificationEmail(email)}
            >
              Send Verification Email
            </Button>.
          </>
        );
    }
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
                questions, you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.
              </Alert>
            </>
          }
          {
            status === 'error' &&
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

export default Verification;
