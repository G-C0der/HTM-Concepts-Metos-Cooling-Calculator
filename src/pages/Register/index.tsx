import React from 'react';
import { Button, TextField, Typography, Checkbox, FormControlLabel,
  Grid, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

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
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('No password provided')
    .min(8, 'Password is too short - should be 8 characters minimum')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]+/, 'Password must contains at least one digit.')
    .matches(/[!@#$%^&*()]+/, 'Password must contains at least one special character.'),
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
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits')
    .required('Phone number is required'),
  company: yup
    .string()
    .required('Company name is required'),
  website: yup
    .string()
    .url('Must be a valid URL')
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
      console.log(values);
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
              <InputLabel id="title-label">Title</InputLabel>
              <Select
                labelId="title-label"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
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
              error={formik.touched.fname && Boolean(formik.errors.fname)}
              helperText={formik.touched.fname && formik.errors.fname}
              label="First Name"
              name="fname"
              value={formik.values.fname}
              onChange={formik.handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              error={formik.touched.lname && Boolean(formik.errors.lname)}
              helperText={formik.touched.lname && formik.errors.lname}
              label="Last Name"
              name="lname"
              value={formik.values.lname}
              onChange={formik.handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              error={formik.touched.street && Boolean(formik.errors.street)}
              helperText={formik.touched.street && formik.errors.street}
              label="Street"
              name="street"
              value={formik.values.street}
              onChange={formik.handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              error={formik.touched.zip && Boolean(formik.errors.zip)}
              helperText={formik.touched.zip && formik.errors.zip}
              label="ZIP Code"
              name="zip"
              value={formik.values.zip}
              onChange={formik.handleChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                id="country"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
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
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              label="Phone Number"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              label="Company Name"
              name="company"
              value={formik.values.company}
              onChange={formik.handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              error={formik.touched.website && Boolean(formik.errors.website)}
              helperText={formik.touched.website && formik.errors.website}
              label="Website"
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
