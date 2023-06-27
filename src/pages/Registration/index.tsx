import React, {useContext, useEffect, useState} from 'react';
import {
  Button, TextField, Typography, Checkbox, FormControlLabel,
  Grid, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import {UserContext} from "../../contexts";
import {htmConceptsEmail} from "../../config";
import {
  emailValidationSchema,
  userFieldLengths,
  passwordSpecialCharacters,
  passwordValidationSchema, checkSpamFolderMessage
} from "../../constants";
import {getCode, getNames} from 'country-list';
import {LoadingButton} from "../../components/LoadingButton";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import {ApiError, ApiResponse} from "../../types";
import {TempAlert} from "../../components/TempAlert";
import {ErrorAlert} from "../../components/ErrorAlert";
import SendIcon from "@mui/icons-material/Send";

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required.')
    .max(userFieldLengths.title.max, `Title is too long - should be maximum ${userFieldLengths.title.max} characters.`),
  fname: yup
    .string()
    .required('First name is required.')
    .max(userFieldLengths.fname.max, `First name is too long - should be maximum ${userFieldLengths.fname.max} characters.`),
  lname: yup
    .string()
    .required('Last name is required.')
    .max(userFieldLengths.lname.max, `Last name is too long - should be maximum ${userFieldLengths.lname.max} characters.`),
  email: emailValidationSchema,
  password: passwordValidationSchema,
  passwordRetype: passwordValidationSchema
    .oneOf([yup.ref('password')], 'Passwords must match.'),
  street: yup
    .string()
    .required('Street is required.')
    .max(userFieldLengths.street.max, `Street is too long - should be maximum ${userFieldLengths.street.max} characters.`),
  city: yup
    .string()
    .required('City is required.')
    .max(userFieldLengths.city.max, `City is too long - should be maximum ${userFieldLengths.city.max} characters.`),
  zip: yup
    .string()
    .required('ZIP code is required.')
    .max(userFieldLengths.zip.max, `ZIP code is too long - should be maximum ${userFieldLengths.zip.max} characters.`),
  country: yup
    .string()
    .required('Country is required.')
    .max(userFieldLengths.country.max, `Country is too long - should be maximum ${userFieldLengths.country.max} characters.`),
  phone: yup
    .string()
    .required('Phone number is required.')
    .max(userFieldLengths.phone.max, `Phone is too long - should be maximum ${userFieldLengths.phone.max} characters.`),
  company: yup
    .string()
    .required('Company name is required.')
    .max(userFieldLengths.company.max, `Company name is too long - should be maximum ${userFieldLengths.company.max} characters.`),
  website: yup
    .string()
    .required('Website is required.')
    .max(userFieldLengths.website.max, `Website is too long - should be maximum ${userFieldLengths.website.max} characters.`)
    .matches(/^(https?:\/\/)?([a-z]+\.)?.+\.[a-z]{2,}(\/.*)*$/i, 'URL is invalid.'),
  tnc: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions.')
});

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
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      const registerResponse = await register(values);
      if (registerResponse.success) {
        setSuccessCount(previousCount => previousCount + 1);
        if (registerResponse.data.wasEmailSent) setVerificationWarning(false);
        else setVerificationWarning(true);
      }
      else setError(registerResponse.error!);

      setIsLoading(false);
    }
  });

  const countries = getNames().sort();
  const titles = ["Mr.", "Ms."];

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
            <FormControl fullWidth>
              <InputLabel id="title-label">Title*</InputLabel>
              <Select
                label="Title*"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
              >
                {titles.map((title) => (
                  <MenuItem key={title} value={title}>{title}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{formik.touched.title && formik.errors.title}</FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.fname && Boolean(formik.errors.fname)}
              helperText={formik.touched.fname && formik.errors.fname}
              label="First Name*"
              name="fname"
              value={formik.values.fname}
              onChange={formik.handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.lname && Boolean(formik.errors.lname)}
              helperText={formik.touched.lname && formik.errors.lname}
              label="Last Name*"
              name="lname"
              value={formik.values.lname}
              onChange={formik.handleChange}
              margin="normal"
            />

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
              margin="normal"
            />

            <Tooltip title={`Allowed special characters: ${passwordSpecialCharacters}`} placement="right">
              <TextField
                fullWidth
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                label="Password*"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InfoIcon color="action" />
                  ),
                }}
              />
            </Tooltip>

            <Tooltip title={`Allowed special characters: ${passwordSpecialCharacters}`} placement="right">
              <TextField
                fullWidth
                onBlur={formik.handleBlur}
                error={formik.touched.passwordRetype && Boolean(formik.errors.passwordRetype)}
                helperText={formik.touched.passwordRetype && formik.errors.passwordRetype}
                label="Retype password*"
                type="password"
                name="passwordRetype"
                value={formik.values.passwordRetype}
                onChange={formik.handleChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InfoIcon color="action" />
                  ),
                }}
              />
            </Tooltip>

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.street && Boolean(formik.errors.street)}
              helperText={formik.touched.street && formik.errors.street}
              label="Street*"
              name="street"
              value={formik.values.street}
              onChange={formik.handleChange}
              margin="normal"
              autoComplete="street-address"
            />

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              label="City*"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.zip && Boolean(formik.errors.zip)}
              helperText={formik.touched.zip && formik.errors.zip}
              label="ZIP Code*"
              name="zip"
              value={formik.values.zip}
              onChange={formik.handleChange}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="country-label">Country*</InputLabel>
              <Select
                label="Country*"
                id="country"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.country && Boolean(formik.errors.country)}
              >
                {countries.map((countryName) => (
                  <MenuItem key={getCode(countryName)} value={getCode(countryName)}>{countryName}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{formik.touched.country && formik.errors.country}</FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              label="Phone Number*"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              label="Company Name*"
              name="company"
              value={formik.values.company}
              onChange={formik.handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              onBlur={formik.handleBlur}
              error={formik.touched.website && Boolean(formik.errors.website)}
              helperText={formik.touched.website && formik.errors.website}
              label="Website*"
              name="website"
              value={formik.values.website}
              onChange={formik.handleChange}
              margin="normal"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.tnc}
                  onChange={formik.handleChange}
                  name="tnc"
                />
              }
              label="I accept the Terms and Conditions"
            />

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

export default Registration;
