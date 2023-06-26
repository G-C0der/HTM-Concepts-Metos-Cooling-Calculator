import React, {useContext, useEffect, useState} from 'react';
import {Alert, Button, Grid, Paper, Snackbar, TextField, Typography} from "@mui/material";
import {AuthContext, UserContext} from "../../contexts";
import {useNavigate} from "react-router-dom";
import {htmConceptsEmail} from "../../config";
import {SendEmailForm} from "../../components/SendEmailForm";
import * as yup from 'yup';
import {
  emailValidationSchema,
  passwordValidationSchema
} from "../../constants";
import { useFormik } from 'formik';
import {ApiResponse} from "../../types";
import {FadeAlert} from "../../components/TempAlert";

const incompleteErrors = {
  userAccountNotYetVerified: 'Your user account hasn\'t been verified yet.',
  userAccountNotYetActivated: 'Your user account is currently inactive.'
};

const validationSchema = yup.object({
  email: emailValidationSchema,
  password: passwordValidationSchema,
});

const Login = () => {
  const [error, setError] = useState<string | React.ReactNode>('');
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
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
      const loginResponse = await login(values);
  
      if (!loginResponse.success) setError(completeError(loginResponse.error!));
    }
  });

  const completeError = (error: string) => {
    if (!Object.values(incompleteErrors).includes(error)) return error;

    switch (error) {
      case incompleteErrors.userAccountNotYetVerified:
        return (
          <>
            {error} Please click on the "Verify Account" button in the verification email you have got after
            your registration. If you need a new verification email,
            <Button
              style={{backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "0 10px",
                textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "12px",
                margin: "0 0 0 3px", cursor: "pointer"}}
              onClick={async () => await sendVerificationEmail(formik.values.email)}
            >
              click here
            </Button>.
          </>
        );
      case incompleteErrors.userAccountNotYetActivated:
        return (
          <>
            {error} We're reviewing your user account and email you, once your user account has been activated.
            If you need further information, you can contact us <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>.
          </>
        );
    }
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

            <Button
              fullWidth
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginTop: 16 }}
            >
              Sign in
            </Button>

            <Button
              fullWidth
              variant="outlined"
              style={{ marginTop: 16 }}
              onClick={() => navigate('/registration')}
            >
              Register
            </Button>

            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              style={{ marginTop: 16 }}
              onClick={() => setShowResetPasswordForm(prevValue => !prevValue)}
            >
              Reset Password
            </Button>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </form>

          {
            showResetPasswordForm &&
            <SendEmailForm
              sendEmailCallback={sendResetPasswordEmail}
              setSendEmailResponse={setSendEmailResponse}
              buttonText='Send Password Reset Email'
            />
          }
          {
            <FadeAlert
              severity='success'
              message='Email has been sent.'
              condition={sendEmailResponse?.success}
              resetCondition={() => setSendEmailResponse(null)}
            />
          }
          {
            <FadeAlert
              severity='error'
              message={<>{sendEmailResponse?.error} If you need support you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.</>}
              condition={sendEmailResponse?.success === false}
              resetCondition={() => setSendEmailResponse(null)}
            />
          }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;