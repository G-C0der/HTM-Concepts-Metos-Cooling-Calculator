import React from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {
  passwordSpecialCharacters,
} from "../../constants";
import InfoIcon from "@mui/icons-material/Info";
import {getCode, getNames} from "country-list";
import {FormikProps} from "formik";
import {UserForm, UserFormEdit} from "../../types";

interface UserFormProps {
  formik: FormikProps<UserForm | UserFormEdit>;
}

const UserFormFields = ({ formik }: UserFormProps) => {
  const isUserFormType = (form: FormikProps<any>): form is FormikProps<UserForm> => ("email" in form.values);

  const countries = getNames().sort();
  const titles = ["Mr.", "Ms."];

  return (
    <>
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

      {
        isUserFormType(formik) && (
          <>
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
          </>
        )
      }

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
    </>
  );
};

export {
  UserFormFields
};