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
import {escapeForRegExp} from "../../utils";
import {UserContext} from "../../contexts";
import {htmConceptsEmail} from "../../config";

const passwordSpecialCharacters = '*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|\\';
const passwordSpecialCharactersDoubleEscaped = escapeForRegExp(passwordSpecialCharacters);

const fieldLengths = {
  title: { max: 64 },
  fname: { max: 64 },
  lname: { max: 64 },
  email: { max: 128 },
  password: { min: 8 },
  street: { max: 128 },
  city: { max: 64 },
  zip: { max: 16 },
  country: { max: 64 },
  phone: { max: 32 },
  company: { max: 256 },
  website: { max: 512 }
};

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required.')
    .max(fieldLengths.title.max, `Title is too long - should be maximum ${fieldLengths.title.max} characters.`),
  fname: yup
    .string()
    .required('First name is required.')
    .max(fieldLengths.fname.max, `First name is too long - should be maximum ${fieldLengths.fname.max} characters.`),
  lname: yup
    .string()
    .required('Last name is required.')
    .max(fieldLengths.lname.max, `Last name is too long - should be maximum ${fieldLengths.lname.max} characters.`),
  email: yup
    .string()
    .required('Email is required.')
    .max(fieldLengths.email.max, `Email is too long - should be maximum ${fieldLengths.email.max} characters.`)
    .email('Email is invalid.'),
  password: yup
    .string()
    .required('Password is required.')
    .matches(new RegExp(`^[a-zA-Z0-9${passwordSpecialCharactersDoubleEscaped}]+$`),
      `Password can only contain Latin letters, numbers, and following special characters: ${passwordSpecialCharacters}.`)
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[0-9]+/, 'Password must contain at least one digit.')
    .matches(new RegExp(`[${passwordSpecialCharactersDoubleEscaped}]+`),
      'Password must contain at least one special character.')
    .min(fieldLengths.password.min, `Password is too short - should be minimum ${fieldLengths.password.min} characters.`),
  street: yup
    .string()
    .required('Street is required.')
    .max(fieldLengths.street.max, `Street is too long - should be maximum ${fieldLengths.street.max} characters.`),
  city: yup
    .string()
    .required('City is required.')
    .max(fieldLengths.city.max, `City is too long - should be maximum ${fieldLengths.city.max} characters.`),
  zip: yup
    .string()
    .required('ZIP code is required.')
    .max(fieldLengths.zip.max, `ZIP code is too long - should be maximum ${fieldLengths.zip.max} characters.`),
  country: yup
    .string()
    .required('Country is required.')
    .max(fieldLengths.country.max, `Country is too long - should be maximum ${fieldLengths.country.max} characters.`),
  phone: yup
    .string()
    .required('Phone number is required.')
    .max(fieldLengths.phone.max, `Phone is too long - should be maximum ${fieldLengths.phone.max} characters.`),
  company: yup
    .string()
    .required('Company name is required.')
    .max(fieldLengths.company.max, `Company name is too long - should be maximum ${fieldLengths.company.max} characters.`),
  website: yup
    .string()
    .required('Website is required.')
    .max(fieldLengths.website.max, `Website is too long - should be maximum ${fieldLengths.website.max} characters.`)
    .matches(/^(https?:\/\/)?([a-z]+\.)?.+\.[a-z]{2,}(\/.*)*$/i, 'URL is invalid.'),
  tnc: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions.')
});

const Register = () => {
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

  const countries = ["Switzerland", "Germany", "France", "Italy"];
  const titles = ["Mr.", "Mrs.", "Ms.", "Dr."];

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
          <Typography variant="h5" align="center" component="h1" gutterBottom>
            Register
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
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
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

export default Register;
