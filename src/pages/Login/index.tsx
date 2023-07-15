import React, {useContext, useState} from 'react';
import {Button, Grid, Paper, TextField, Typography} from "@mui/material";
import {AuthContext, UserContext} from "../../contexts";
import {useNavigate} from "react-router-dom";
import {htmConceptsEmail} from "../../config";
import {SendEmailForm} from "../../components/SendEmailForm";
import * as yup from 'yup';
import {
  checkSpamFolderMessage,
  emailValidationSchema,
  passwordValidationSchema, supportContactMessage
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
import {mapMessageKeyword} from "../../utils";

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

            {
              error?.message !== incompleteErrors.userAccountNotYetVerified &&
              error?.message !== incompleteErrors.userAccountNotYetActivated &&
              <ErrorAlert error={error} spaceAbove />
            }
            {
              error?.message === incompleteErrors.userAccountNotYetVerified &&
              <ErrorAlert error={{ ...error, modifiedMessage: (
                  <>
                    {error.message} Please click on the "Verify Account" button in the verification email you have got after
                    your registration.
                    <br/>
                    {checkSpamFolderMessage}<br/>
                    If you need a new verification email, click here:
                    <LoadingButton
                      variant="contained"
                      color='secondary'
                      style={{ width: '210px' }}
                      startIcon={<SendIcon />}
                      small
                      onClick={handleSendVerificationEmailClick}
                      loading={isSendEmailLoading}
                    >
                      send verification email
                    </LoadingButton>
                    <br/>
                    {mapMessageKeyword(supportContactMessage)}
                  </>
                ) }} spaceAbove />
            }
            {
              error?.message === incompleteErrors.userAccountNotYetActivated &&
              <ErrorAlert error={{ ...error, modifiedMessage: `${error.message} We're reviewing your user account and 
                email you, once your user account has been activated. ${supportContactMessage}` }} spaceAbove />
            }

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
              callback={sendResetPasswordEmail}
              setResponse={setSendEmailResponse}
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

export default Login;