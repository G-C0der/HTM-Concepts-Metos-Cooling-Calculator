import React from 'react';
import Tooltip from "@mui/material/Tooltip";
import {passwordSpecialCharacters, passwordValidationSchema} from "../../constants";
import {Button, TextField} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import * as yup from "yup";
import {useFormik} from "formik";

interface PasswordResetFormProps {
  passwordResetCallback: (password: string) => Promise<void>;
}

const validationSchema = yup.object().shape({
  password: passwordValidationSchema,
  passwordRetype: passwordValidationSchema
    .oneOf([yup.ref('password')], 'Passwords must match.')
});

const PasswordResetForm = ({ passwordResetCallback }: PasswordResetFormProps) => {
  const formik = useFormik({
    initialValues: {
      password: '',
      passwordRetype: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await passwordResetCallback(values.password);
    },
  });

  return (
    <form>
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

      <Button
        type='submit'
        style={{backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "5px 10px 5px",
          textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "12px",
          cursor: "pointer"}}
      >
        Reset Password
      </Button>
    </form>
  );
};

export {
  PasswordResetForm
};