import * as yup from "yup";
import {formFieldLengths} from "./form";
import {escapeForRegExp} from "../utils";

const passwordSpecialCharacters = '*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|\\';
const passwordSpecialCharactersDoubleEscaped = escapeForRegExp(passwordSpecialCharacters);

const emailValidationSchema = yup
    .string()
    .required('Email is required.')
    .max(formFieldLengths.email.max, `Email is too long - should be maximum ${formFieldLengths.email.max} characters.`)
    .email('Email is invalid.');

const passwordValidationSchema = yup
  .string()
  .required('Password is required.')
  .matches(new RegExp(`^[a-zA-Z0-9${passwordSpecialCharactersDoubleEscaped}]+$`),
    `Password can only contain Latin letters, numbers, and following special characters: ${passwordSpecialCharacters}.`)
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .matches(/[0-9]+/, 'Password must contain at least one digit.')
  .matches(new RegExp(`[${passwordSpecialCharactersDoubleEscaped}]+`),
    'Password must contain at least one special character.')
  .min(formFieldLengths.password.min, `Password is too short - should be minimum ${formFieldLengths.password.min} characters.`);

export {
  passwordSpecialCharacters,
  emailValidationSchema,
  passwordValidationSchema
};