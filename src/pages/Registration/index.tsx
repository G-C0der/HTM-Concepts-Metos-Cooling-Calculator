import React, {useContext, useEffect, useState} from 'react';
import {
  Button, TextField, Typography, Checkbox, FormControlLabel,
  Grid, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, Alert, Box
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
  formFieldLengths,
  passwordSpecialCharacters,
  passwordValidationSchema
} from "../../constants";
import {getCode, getNames} from 'country-list';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required.')
    .max(formFieldLengths.title.max, `Title is too long - should be maximum ${formFieldLengths.title.max} characters.`),
  fname: yup
    .string()
    .required('First name is required.')
    .max(formFieldLengths.fname.max, `First name is too long - should be maximum ${formFieldLengths.fname.max} characters.`),
  lname: yup
    .string()
    .required('Last name is required.')
    .max(formFieldLengths.lname.max, `Last name is too long - should be maximum ${formFieldLengths.lname.max} characters.`),
  email: emailValidationSchema,
  password: passwordValidationSchema,
  street: yup
    .string()
    .required('Street is required.')
    .max(formFieldLengths.street.max, `Street is too long - should be maximum ${formFieldLengths.street.max} characters.`),
  city: yup
    .string()
    .required('City is required.')
    .max(formFieldLengths.city.max, `City is too long - should be maximum ${formFieldLengths.city.max} characters.`),
  zip: yup
    .string()
    .required('ZIP code is required.')
    .max(formFieldLengths.zip.max, `ZIP code is too long - should be maximum ${formFieldLengths.zip.max} characters.`),
  country: yup
    .string()
    .required('Country is required.')
    .max(formFieldLengths.country.max, `Country is too long - should be maximum ${formFieldLengths.country.max} characters.`),
  phone: yup
    .string()
    .required('Phone number is required.')
    .max(formFieldLengths.phone.max, `Phone is too long - should be maximum ${formFieldLengths.phone.max} characters.`),
  company: yup
    .string()
    .required('Company name is required.')
    .max(formFieldLengths.company.max, `Company name is too long - should be maximum ${formFieldLengths.company.max} characters.`),
  website: yup
    .string()
    .required('Website is required.')
    .max(formFieldLengths.website.max, `Website is too long - should be maximum ${formFieldLengths.website.max} characters.`)
    .matches(/^(https?:\/\/)?([a-z]+\.)?.+\.[a-z]{2,}(\/.*)*$/i, 'URL is invalid.'),
  tnc: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions.')
});

const Registration = () => {
  const [error, setError] = useState('');
  const [successCount, setSuccessCount] = useState(0);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationWarning, setVerificationWarning] = useState(false);

  const { register, sendVerificationEmail } = useContext(UserContext);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      fname: '',
      lname: '',
      email: '',
      password: '',
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
      const registerResponse = await register(values);
      if (registerResponse.success) {
        setSuccessCount(previousCount => previousCount + 1);
        if (registerResponse.data.wasVerificationEmailSent) setVerificationWarning(false);
        else setVerificationWarning(true);
      }
      else setError(registerResponse.error!);
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
      setError('');
      setRegisteredEmail(formik.values.email);
      formik.resetForm();
      window.scrollTo(0, 0); // scroll to page top
    }
  }, [successCount]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                style={{ marginBottom: 16, alignSelf: 'flex-start', whiteSpace: 'nowrap' }}
              >
                Back to Login
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h5" component="h1" align="center" gutterBottom>
                Account Registration
              </Typography>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
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
                Please click on the provided link to verify your email.<br/>
                If you haven't got a verification email,
                <Button
                  style={{backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "0 10px",
                    textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "12px",
                    margin: "0 0 0 3px", cursor: "pointer"}}
                  onClick={async () => await sendVerificationEmail(registeredEmail)}
                >
                  click here
                </Button>
                .<br/>
                If you need further assistance, you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.
              </Alert>
          }
          {
            (successCount > 0 && verificationWarning) &&
              <Alert severity='warning' sx={{ mb: 2 }}>
                There was a problem sending the verification email to {registeredEmail}.<br/>
                To trigger the verification email transmission,
                <Button
                  style={{backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "0 10px",
                    textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "12px",
                    margin: "0 0 0 3px", cursor: "pointer"}}
                  onClick={async () => await sendVerificationEmail(registeredEmail)}
                >
                  click here
                </Button>
                .<br/>
                If you need further assistance, you can contact us <a href={`mailto:${htmConceptsEmail}`}>here</a>.
              </Alert>
          }
          <form onSubmit={formik.handleSubmit} autoComplete="on">
            <FormControl fullWidth>
              <InputLabel id="title-label">Title*</InputLabel>
              <Select
                labelId="title-label"
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
                labelId="country-label"
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

            <Button
              fullWidth
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginTop: 16 }}
              disabled={!formik.values.tnc || !formik.isValid}
            >
              Register
            </Button>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Registration;
