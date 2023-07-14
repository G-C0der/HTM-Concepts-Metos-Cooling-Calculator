import * as yup from "yup";
import {userFieldLengths} from "./user";
import {escapeForRegExp} from "../utils";

const passwordSpecialCharacters = '*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|\\';
const passwordSpecialCharactersDoubleEscaped = escapeForRegExp(passwordSpecialCharacters);

const emailValidationSchema = yup
    .string()
    .required('Email is required.')
    .max(userFieldLengths.email.max, `Email is too long - should be maximum ${userFieldLengths.email.max} characters.`)
    .email('Email is invalid.');

const passwordValidationSchema = yup
  .string()
  .required('Password is required.')
  .matches(new RegExp(`^[a-zA-Z0-9${passwordSpecialCharactersDoubleEscaped}]+$`),
    `Password can only contain Latin letters, numbers, and following special characters: ${passwordSpecialCharacters}`)
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .matches(/[0-9]+/, 'Password must contain at least one digit.')
  .matches(new RegExp(`[${passwordSpecialCharactersDoubleEscaped}]+`),
    'Password must contain at least one special character.')
  .min(userFieldLengths.password.min, `Password is too short - should be minimum ${userFieldLengths.password.min} characters.`);

const getUserFormValidationSchema = (edit: boolean) => yup.object({
  title: yup
    .string()
    .required('Title is required.')
    .max(userFieldLengths.title.max, `Title is too long - should be maximum ${userFieldLengths.title.max} characters.`),
  fname: yup
    .string()
    .required('First name is required.')
    .max(userFieldLengths.fname.max, `First name is too long - should be maximum ${userFieldLengths.fname.max} characters.`),
  lname: yup
    .string()
    .required('Last name is required.')
    .max(userFieldLengths.lname.max, `Last name is too long - should be maximum ${userFieldLengths.lname.max} characters.`),
  ...(!edit && {
    email: emailValidationSchema,
    password: passwordValidationSchema,
    passwordRetype: passwordValidationSchema
      .oneOf([yup.ref('password')], 'Passwords must match.'),
    tnc: yup
      .boolean()
      .oneOf([true], 'You must accept the terms and conditions.')
  }),
  street: yup
    .string()
    .required('Street is required.')
    .max(userFieldLengths.street.max, `Street is too long - should be maximum ${userFieldLengths.street.max} characters.`),
  city: yup
    .string()
    .required('City is required.')
    .max(userFieldLengths.city.max, `City is too long - should be maximum ${userFieldLengths.city.max} characters.`),
  zip: yup
    .string()
    .required('ZIP code is required.')
    .max(userFieldLengths.zip.max, `ZIP code is too long - should be maximum ${userFieldLengths.zip.max} characters.`),
  country: yup
    .string()
    .required('Country is required.')
    .max(userFieldLengths.country.max, `Country is too long - should be maximum ${userFieldLengths.country.max} characters.`),
  phone: yup
    .string()
    .required('Phone number is required.')
    .max(userFieldLengths.phone.max, `Phone is too long - should be maximum ${userFieldLengths.phone.max} characters.`),
  company: yup
    .string()
    .required('Company name is required.')
    .max(userFieldLengths.company.max, `Company name is too long - should be maximum ${userFieldLengths.company.max} characters.`),
  website: yup
    .string()
    .required('Website is required.')
    .max(userFieldLengths.website.max, `Website is too long - should be maximum ${userFieldLengths.website.max} characters.`)
    .matches(/^(https?:\/\/)?([a-z]+\.)?.+\.[a-z]{2,}(\/.*)*$/i, 'URL is invalid.')
});

export {
  passwordSpecialCharacters,
  emailValidationSchema,
  passwordValidationSchema,
  getUserFormValidationSchema
};