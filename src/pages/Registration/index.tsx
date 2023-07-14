import React, {useContext, useEffect, useState} from 'react';
import {
  Button, Typography, Grid, Paper, Alert
} from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../../contexts";
import {htmConceptsEmail} from "../../config";
import {
  checkSpamFolderMessage, getUserFormValidationSchema
} from "../../constants";
import {LoadingButton} from "../../components/LoadingButton";
import {ApiError, ApiResponse} from "../../types";
import {TempAlert} from "../../components/TempAlert";
import SendIcon from "@mui/icons-material/Send";
import {UserFormFields} from "../../components/UserFormFields";
import {ErrorAlert} from "../../components/ErrorAlert";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const Registration = () => {
  const [error, setError] = useState<ApiError>();
  const [successCount, setSuccessCount] = useState(0);

  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationWarning, setVerificationWarning] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isSendEmailLoading, setIsSendEmailLoading] = useState(false);
  const [sendEmailResponse, setSendEmailResponse] = useState<ApiResponse | null>(null);

  const { register, sendVerificationEmail } = useContext(UserContext);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      fname: '',
      lname: '',
      email: '',
      password: '',
      passwordRetype: '',
      street: '',
      city: '',
      zip: '',
      country: '',
      phone: '',
      company: '',
      website: '',
      tnc: false,
    },
    validationSchema: getUserFormValidationSchema(false),
    onSubmit: async (values) => {
      setIsLoading(true);

      const registerResponse = await register(values);
      if (registerResponse.success) {
        setSuccessCount(previousCount => previousCount + 1);
        if (registerResponse.data!.wasEmailSent) setVerificationWarning(false);
        else setVerificationWarning(true);
      }
      else setError(registerResponse.error!);

      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (error) {
      setSuccessCount(0);
      setRegisteredEmail('');
      setVerificationWarning(false);
      window.scrollTo(0, document.body.scrollHeight); // scroll to page bottom
    }
  }, [error]);

  useEffect(() => {
    if (successCount > 0) {
      setError(undefined);
      setRegisteredEmail(formik.values.email);
      formik.resetForm();
      window.scrollTo(0, 0); // scroll to page top
    }
  }, [successCount]);

  const handleSendVerificationEmailClick = async () => {
    setIsSendEmailLoading(true);

    const sendEmailResponse = await sendVerificationEmail(registeredEmail);
    setSendEmailResponse(sendEmailResponse);

    setIsSendEmailLoading(false);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Typography variant="h5" align="center" component="h1" gutterBottom>
            Account Registration
          </Typography>
          {
            (successCount > 0) &&
              <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
                Your user account has been successfully registered!
              </Alert>
          }
          {
            (successCount > 0 && !verificationWarning) &&
              <Alert severity="info" sx={{ mb: 2 }}>
                We have sent a verification email to {registeredEmail}.<br/>
                Please click on the provided button / link to verify your email.<br/>
                {checkSpamFolderMessage}<br/>
                If you did not receive a verification email, click here:
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
                <br/>
                If you need further assistance, you can contact us <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>.
              </Alert>
          }
          {
            (successCount > 0 && verificationWarning) &&
              <Alert severity='warning' sx={{ mb: 2 }}>
                There was a problem sending the verification email to {registeredEmail}.<br/>
                To trigger the verification email transmission, click here:
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
                .<br/>
                If you need further assistance, you can contact us <a href={`mailto:${htmConceptsEmail}`} target="_blank" rel="noreferrer">here</a>.
              </Alert>
          }
          <Button
            variant="outlined"
            style={{ marginBottom: 16 }}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>

          <form onSubmit={formik.handleSubmit} autoComplete="on">
            <UserFormFields formik={(formik as any)} /> {/*TODO: check why not working with given type*/}

            <ErrorAlert error={error} spaceAbove />

            <LoadingButton
              fullWidth
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginTop: 16 }}
              startIcon={<AppRegistrationIcon />}
              loading={isLoading}
              disabled={!formik.values.tnc || !formik.isValid}
            >
              Register
            </LoadingButton>
          </form>

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

export default Registration;
