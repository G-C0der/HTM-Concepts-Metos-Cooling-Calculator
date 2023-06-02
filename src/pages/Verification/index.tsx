import React, { useEffect, useState } from 'react';
import { CircularProgress, Paper, Typography, Alert, Box } from '@mui/material';
import { Grid } from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";

const Verification = (props: any) => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const { token } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/');

    const verify = async () => {
      // const response = await verifyUser(token);
      //
      // if (response.success) {
      //   setStatus('success');
      // } else {
      //   setStatus('error');
      //   setError(response.error);
      // }
    };

    verify();
  }, [token]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Typography variant="h5" align="center" component="h1" gutterBottom>
            Account Verification
          </Typography>

          {
            status === 'loading' &&
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 8, mb: 8 }}>
              <CircularProgress />
            </Box>
          }
          {
            status === 'success' &&
            <Alert severity="success">
              <Typography variant="h5" align="center">
                Your account has been verified successfully.
              </Typography>
              <Typography variant="body1">
                Please note that your user account is currently inactive.
                We will review the provided data and email you, once your user account has been activated.
                We aim to complete the activation as soon as possible. If you do not receive an email from us or have any
                questions, please feel free to reply to this email.
              </Typography>
            </Alert>
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
