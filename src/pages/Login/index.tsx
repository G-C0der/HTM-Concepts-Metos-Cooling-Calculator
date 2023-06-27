import React, {useContext, useEffect, useState} from 'react';
import {Button, Grid, Paper, TextField, Typography} from "@mui/material";
import {AuthContext, UserContext} from "../../contexts";
import {useNavigate} from "react-router-dom";
import {htmConceptsEmail} from "../../config";
import {SendEmailForm} from "../../components/SendEmailForm";
import * as yup from 'yup';
import {
  checkSpamFolderMessage,
  emailValidationSchema,
  passwordValidationSchema
} from "../../constants";
import { useFormik } from 'formik';
import {LoadingButton} from "../../components/LoadingButton";
import LoginIcon from '@mui/icons-material/Login';
import {ApiError, ApiResponse} from "../../types";
import {TempAlert} from "../../components/TempAlert";
import {ErrorAlert} from "../../components/ErrorAlert";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LockResetIcon from "@mui/icons-material/LockReset";
import SendIcon from '@mui/icons-material/Send';

const incompleteErrors = {
  userAccountNotYetVerified: 'Your user account hasn\'t been verified yet.',
  userAccountNotYetActivated: 'Your user account is currently inactive.'
};

const validationSchema = yup.object({
  email: emailValidationSchema,
  password: passwordValidationSchema,
});

const Login = () => {
  const [error, setError] = useState<ApiError>();
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isSendEmailLoading, setIsSendEmailLoading] = useState(false);
  const [sendEmailResponse, setSendEmailResponse] = useState<ApiResponse | null>(null);

  const { login } = useContext(AuthContext);
  const { sendVerificationEmail, sendResetPasswordEmail } = useContext(UserContext);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      const loginResponse = await login(values);
      if (!loginResponse.success) setError(loginResponse.error!);

      setIsLoading(false);
    }
  });

  const handleSendVerificationEmailClick = async () => {
    setIsSendEmailLoading(true);

    const sendEmailResponse = await sendVerificationEmail(formik.values.email);
    setSendEmailResponse(sendEmailResponse);

    setIsSendEmailLoading(false);
  };

  // Set modified error message
  useEffect(() => {
    if (error) {
      if (!Object.values(incompleteErrors).includes(error.message)) return;

      let modifiedMessage;

      switch (error.message) {
        case incompleteErrors.userAccountNotYetVerified:
          modifiedMessage = (
            <>
              {error.message} Please click on the "Verify Account" button in the verification email you have got after
              your registration. If you need a new verification email, click here:
              <LoadingButton
                variant="contained"
                color='secondary'
                startIcon={<SendIcon />}
                small
                onClick={handleSendVerificationEmailClick}
                loading={isSendEmailLoading}
              >
                send verification email
              </LoadingButton>
            </>
          );
          break;
        case incompleteErrors.userAccountNotYetActivated:
          modifiedMessage = (
            <>
              {error.message} We're reviewing your user account and email you, once your user account has been activated.
              If you need further information, you can contact us <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>.
            </>
          );
          break;
      }

      setError({ ...error, modifiedMessage });
    }
  }, [error]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Typography variant="h5" align="center" component="h1" gutterBottom>
            Cooling Calculator
          </Typography>

          <form onSubmit={formik.handleSubmit} autoComplete='on'>
            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              margin="normal"
            />

            <ErrorAlert error={error} spaceAbove />

            <LoadingButton
              fullWidth
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginTop: 16 }}
              startIcon={<LoginIcon />}
              loading={isLoading}
            >
              Sign in
            </LoadingButton>

            <Button
              fullWidth
              variant="outlined"
              style={{ marginTop: 16 }}
              startIcon={<AppRegistrationIcon />}
              onClick={() => navigate('/registration')}
            >
              Register
            </Button>

            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              style={{ marginTop: 16 }}
              startIcon={<LockResetIcon />}
              onClick={() => setShowResetPasswordForm(prevValue => !prevValue)}
            >
              Reset Password
            </Button>
          </form>

          {
            showResetPasswordForm &&
            <SendEmailForm
              sendEmailCallback={sendResetPasswordEmail}
              setSendEmailResponse={setSendEmailResponse}
              buttonText='Send Password Reset Email'
              buttonColor='secondary'
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
              message={<>{sendEmailResponse.error.message} If you need support you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.</>}
              condition={sendEmailResponse.success === false}
              resetCondition={() => setSendEmailResponse(null)}
            />
          }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;