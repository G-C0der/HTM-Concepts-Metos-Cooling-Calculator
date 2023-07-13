import React, {useContext, useEffect, useState} from 'react';
import {ApiDataUserFormEdit, ApiResponse, UserFormEdit} from "../../types";
import {UserFormFields} from "../UserFormFields";
import {LoadingButton} from "../LoadingButton";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {useFormik} from "formik";
import {getUserFormValidationSchema} from "../../constants";
import {UserContext} from "../../contexts";
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";

interface UserEditFormProps {
  fetchFormErrorCallback: (fetchFormErrorResponse: ApiResponse<ApiDataUserFormEdit>) => void;
  editProfileCallback: (editProfileResponse: ApiResponse) => void;
}

const UserEditForm = ({ fetchFormErrorCallback, editProfileCallback }: UserEditFormProps) => {
  const [isFetchFormLoading, setIsFetchFormLoading] = useState(false);
  const [isEditProfileLoading, setIsEditProfileLoading] = useState(false);
  const [form, setForm] = useState<UserFormEdit>();

  const { fetchForm, editProfile } = useContext(UserContext);

  useEffect(() => {
    if (!form) {
      const fetchUserForm = async () => {
        setIsFetchFormLoading(true);

        const fetchFormResponse = await fetchForm();

        if (fetchFormResponse.success) setForm(fetchFormResponse.data!.form);
        else fetchFormErrorCallback(fetchFormResponse);
      };

      fetchUserForm();
    } else {
      const timer = setTimeout(() => {
        setIsFetchFormLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [form]);

  const formik = useFormik({
    initialValues: {
      title: form ? form.title : '',
      fname: form ? form.fname : '',
      lname: form ? form.lname : '',
      street: form ? form.street : '',
      city: form ? form.city : '',
      zip: form ? form.zip : '',
      country: form ? form.country!.toUpperCase() : '',
      phone: form ? form.phone : '',
      company: form ? form.company : '',
      website: form ? form.website : '',
    },
    validationSchema: getUserFormValidationSchema(true),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsEditProfileLoading(true);

      const editProfileResponse = await editProfile(values);
      editProfileCallback(editProfileResponse);

      setIsEditProfileLoading(false);
    }
  });

  return isFetchFormLoading ? (
    <Box style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      <CircularProgress size={80} />
    </Box>
  ) : (
    <form onSubmit={formik.handleSubmit} autoComplete="on">
      <UserFormFields formik={(formik as any)} /> {/*TODO: check why not working with given type*/}

      <LoadingButton
        fullWidth
        type="submit"
        color="primary"
        variant="contained"
        style={{ marginTop: 16 }}
        startIcon={<SaveAltIcon />}
        loading={isEditProfileLoading}
        disabled={!formik.isValid}
      >
        Update Profile
      </LoadingButton>
    </form>
  );
};

export {
  UserEditForm
};