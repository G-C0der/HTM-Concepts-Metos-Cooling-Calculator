import React from 'react';
import { Button, TextField, Typography, Checkbox, FormControlLabel,
  Grid, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import {escapeForRegExp} from "../../utils";

const passwordSpecialCharacters = '*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|\\';
const passwordSpecialCharactersDoubleEscaped = escapeForRegExp(passwordSpecialCharacters);

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required'),
  fname: yup
    .string()
    .required('First name is required'),
  lname: yup
    .string()
    .required('Last name is required'),
  email: yup
    .string()
    .email('Email is invalid')
    .required('Email is required'),
  password: yup
    .string()
    .required('No password provided')
    .matches(new RegExp(`^[a-zA-Z0-9${passwordSpecialCharactersDoubleEscaped}]+$`), `Password can only contain Latin letters, numbers, and following special characters: ${passwordSpecialCharacters}.`)
    .min(8, 'Password is too short - should be minimum 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]+/, 'Password must contain at least one digit.')
    .matches(new RegExp(`[${passwordSpecialCharactersDoubleEscaped}]+`), 'Password must contain at least one special character.'),
  street: yup
    .string()
    .required('Street is required'),
  city: yup
    .string()
    .required('City is required'),
  zip: yup
    .string()
    .required('ZIP code is required'),
  country: yup
    .string()
    .required('Country is required'),
  phone: yup
    .string()
    .required('Phone number is required'),
  company: yup
    .string()
    .required('Company name is required'),
  website: yup
    .string()
    .test(
      'url',
      'URL is invalid',
      value => /^(https?:\/\/)?([a-z]+\.)?.+\.[a-z]{2,}$/i.test(value as string)
    )
    .required('Website is required'),
  tnc: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

const Register = () => {
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
    onSubmit: (values) => {
      // TODO: call endpoint
      console.log('form', values);
      navigate('/login');
    },
  });

  const countries = ["Switzerland", "Germany", "France", "Italy"];
  const titles = ["Mr.", "Mrs.", "Ms.", "Dr."];

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 16 }} elevation={3}>
          <Typography variant="h5" align="center" component="h1" gutterBottom>
            Register
          </Typography>
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
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Register;
