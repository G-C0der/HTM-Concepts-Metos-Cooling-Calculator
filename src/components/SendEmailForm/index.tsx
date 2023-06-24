import React from 'react';
import {useFormik} from "formik";
import {Button, TextField} from "@mui/material";
import * as yup from "yup";
import {emailValidationSchema} from "../../constants";
import SendIcon from "@mui/icons-material/Send";

interface SendEmailFormProps {
  sendEmailCallback: (email: string) => Promise<any>;
  buttonText: string;
}

const validationSchema = yup.object().shape({
  email: emailValidationSchema
});

const SendEmailForm = ({ sendEmailCallback, buttonText }: SendEmailFormProps) => {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => await sendEmailCallback(values.email)
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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
        sx={{ mt: 3, mb: 2 }}
      />
      <br/>

      <Button
        type='submit'
        style={{backgroundColor: "#4CAF50", color: "#fff", border: "none", padding: "5px 10px 5px",
          textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "12px",
          cursor: "pointer"}}
        startIcon={<SendIcon />}
      >
        {buttonText}
      </Button>
    </form>
  );
};

export {
  SendEmailForm
};