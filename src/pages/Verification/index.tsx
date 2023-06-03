import React, {useContext, useEffect, useState} from 'react';
import {CircularProgress, Paper, Typography, Alert, Box, Button, TextField} from '@mui/material';
import { Grid } from "@mui/material";
import {useParams} from "react-router-dom";
import {UserContext} from "../../contexts";
import {htmConceptsEmail} from "../../config";
import { useFormik } from 'formik';
import * as yup from "yup";
import {formFieldLengths} from "../../constants";

const specificIncompleteErrors = {
  verificationLinkExpired: 'Your verification link has expired.'
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required.')
    .max(formFieldLengths.email.max, `Email is too long - should be maximum ${formFieldLengths.email.max} characters.`)
    .email('Email is invalid.')
});

const Verification = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<string | React.ReactNode>('');
  const [showResendForm, setShowResendForm] = useState(false);

  const { token } = useParams();

  const { verify, sendVerificationEmail } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Here you can access form values
      await sendVerificationEmail(values.email);
    },
  });

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

    if (error === specificIncompleteErrors.verificationLinkExpired) {
      setShowResendForm(true);

      return (
        <>
          {error}
          To send a new verification email, enter the email associated with your account and click the button
          below.<br/>
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
          {
            showResendForm &&
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                label="Email*"
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                sx={{ mt: 3, mb: 2 }}
              />
              <br/>
              <Button
                type='submit'
                style={{backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "5px 10px 5px",
                  textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "12px",
                  cursor: "pointer"}}
              >
                Send Verification Email
              </Button>
            </form>
          }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Verification;
