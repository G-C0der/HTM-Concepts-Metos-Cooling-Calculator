import * as yup from "yup";
import {formFieldLengths} from "./form";

const emailValidationSchema = {
  email: yup
    .string()
    .required('Email is required.')
    .max(formFieldLengths.email.max, `Email is too long - should be maximum ${formFieldLengths.email.max} characters.`)
    .email('Email is invalid.')
};

export {
  emailValidationSchema
};