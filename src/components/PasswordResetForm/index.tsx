import React, {useState} from 'react';
import Tooltip from "@mui/material/Tooltip";
import {passwordSpecialCharacters, passwordValidationSchema} from "../../constants";
import {TextField} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LockResetIcon from '@mui/icons-material/LockReset';
import * as yup from "yup";
import {useFormik} from "formik";
import {ApiError} from "../../types";
import {ErrorAlert} from "../ErrorAlert";
import {LoadingButton} from "../LoadingButton";

interface PasswordResetFormProps {
  callback: (password: string) => Promise<void>;
  error?: ApiError;
}

const validationSchema = yup.object().shape({
  password: passwordValidationSchema,
  passwordRetype: passwordValidationSchema
    .oneOf([yup.ref('password')], 'Passwords must match.')
});

const PasswordResetForm = ({ callback, error }: PasswordResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordRetype: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      await callback(values.password)

      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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

      <ErrorAlert error={error} spaceAbove spaceBelow />

      <LoadingButton
        fullWidth
        type='submit'
        color="primary"
        variant="contained"
        startIcon={<LockResetIcon />}
        loading={isLoading}
      >
        Reset Password
      </LoadingButton>
    </form>
  );
};

export {
  PasswordResetForm
};