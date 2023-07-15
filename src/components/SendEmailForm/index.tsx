import React, {useState} from 'react';
import {useFormik} from "formik";
import {TextField} from "@mui/material";
import * as yup from "yup";
import {emailValidationSchema} from "../../constants";
import SendIcon from "@mui/icons-material/Send";
import {ApiResponse} from "../../types";
import {LoadingButton} from "../LoadingButton";

interface SendEmailFormProps {
  callback: (email: string) => Promise<any>;
  setResponse: (sendEmailResponse: ApiResponse) => void;
  buttonText: string;
  buttonColor: 'primary' | 'secondary';
}

const validationSchema = yup.object().shape({
  email: emailValidationSchema
});

const SendEmailForm = ({ callback, setResponse, buttonText, buttonColor }: SendEmailFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      const sendEmailResponse = await callback(values.email);
      setResponse(sendEmailResponse);

      setIsLoading(false);
    }
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
        sx={{ mt: 3 }}
      />
      <br/>

      <LoadingButton
        fullWidth
        type='submit'
        color={buttonColor}
        variant="contained"
        style={{ marginTop: 24 }}
        startIcon={<SendIcon />}
        loading={isLoading}
      >
        {buttonText}
      </LoadingButton>
    </form>
  );
};

export {
  SendEmailForm
};