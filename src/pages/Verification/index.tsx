import React, {useContext, useEffect, useState} from 'react';
import { CircularProgress, Paper, Typography, Alert, Box } from '@mui/material';
import { Grid } from "@mui/material";
import {useParams} from "react-router-dom";
import {UserContext} from "../../contexts";
import {htmConceptsEmail} from "../../config";

const Verification = (props: any) => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const { token } = useParams();

  const { verify } = useContext(UserContext);

  useEffect(() => {
    const verifyUser = async () => {
      const verifyResponse = await verify(token!);

      if (verifyResponse.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(verifyResponse.error!);
      }
    };

    verifyUser();
  }, [token]);

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
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="h5" align="center">
                  Your account has been verified successfully.
                </Typography>
              </Alert>
              <Alert severity="info">
                <Typography variant="body1">
                  Please note that your user account is currently inactive.
                  We will review the provided data and email you, once your user account has been activated.
                  We aim to complete the activation as soon as possible. If you do not receive an email from us or have any
                  questions, you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.
                </Typography>
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
