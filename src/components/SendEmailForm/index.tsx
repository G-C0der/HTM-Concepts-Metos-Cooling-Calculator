import React, {useState} from 'react';
import {useFormik} from "formik";
import {TextField} from "@mui/material";
import * as yup from "yup";
import {emailValidationSchema} from "../../constants";
import SendIcon from "@mui/icons-material/Send";
import {ApiResponse} from "../../types";
import {LoadingButton} from "../LoadingButton";

interface SendEmailFormProps {
  sendEmailCallback: (email: string) => Promise<any>;
  setSendEmailResponse: (sendEmailResponse: ApiResponse) => void;
  buttonText: string;
}

const validationSchema = yup.object().shape({
  email: emailValidationSchema
});

const SendEmailForm = ({ sendEmailCallback, setSendEmailResponse, buttonText }: SendEmailFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      const sendEmailResponse = await sendEmailCallback(values.email);
      setSendEmailResponse(sendEmailResponse);

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
        sx={{ mt: 3, mb: 2 }}
      />
      <br/>

      <LoadingButton
        fullWidth
        type='submit'
        color="secondary"
        variant="contained"
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