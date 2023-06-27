import React, {useContext, useEffect, useState} from 'react';
import './style.css';
import {ApiError, User} from "../../types";
import {AuthContext, UserContext} from "../../contexts";
import {CircularProgress} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {toAbsoluteUrl} from "../../utils/url";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {ConfirmationDialog} from "../ConfirmationDialog";
import {LoadingButton} from "../LoadingButton";
import {getName} from 'country-list';
import {ErrorAlert} from "../ErrorAlert";

interface UsersDataGridProps {
  isAdminModalOpen: boolean;
}

const UsersDataGrid = ({ isAdminModalOpen }: UsersDataGridProps) => {
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState<ApiError>();
  const [isLoading, setIsLoading] = useState(true);

  const [pendingUser, setPendingUser] = useState<User>();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(() => () => {});

  const [isActiveStateChangeLoading, setIsActiveStateChangeLoading] = useState(false);

  const { authenticatedUser } = useContext(AuthContext);
  const { list, activate, deactivate } = useContext(UserContext);

  const columns: GridColDef[] = [
    {
      field: 'company',
      headerName: 'Company',
      width: 200
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 60
    },
    {
      field: 'fname',
      headerName: 'First Name',
      width: 140
    },
    {
      field: 'lname',
      headerName: 'Last Name',
      width: 140
    },
    {
      field: 'verified',
      headerName: 'Verified',
      width: 80,
      renderCell: (params) => (
        params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
      ),
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 80,
      renderCell: (params) => (
        params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
      ),
    },
    {
      field: 'admin',
      headerName: 'Admin',
      width: 80,
      renderCell: (params) => (
        params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 300,
      renderCell: (params) => (
        <a href={`mailto:${params.value}`} target="_blank" rel="noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150
    },
    {
      field: 'website',
      headerName: 'Website',
      width: 250,
      renderCell: (params) => (
        <a href={toAbsoluteUrl(params.value)} target="_blank" rel="noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 160,
      valueGetter: (params) => getName(params.value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const id = params.row.id;
        const isVerified = params.row.verified;
        const isActive = params.row.active;

        return (
          <>
            <LoadingButton
              className={`action-button ${isActive ? 'deactivate' : 'activate'}`}
              startIcon={isActive ? <CancelIcon /> : <CheckCircleIcon />}
              onClick={() => {
                setPendingUser(params.row);
                setPendingAction(() => async () => {
                  setIsActiveStateChangeLoading(true);

                  if (isActive) {
                    const deactivateResponse = await deactivate(id);
                    if (deactivateResponse.success) updateUser(id, { active: !isActive });
                  } else {
                    const activateResponse = await activate(id);
                    if (activateResponse.success) updateUser(id, { active: !isActive });
                  }

                  setIsActiveStateChangeLoading(false);
                });
                setIsConfirmDialogOpen(true);
              }}
              loading={isActiveStateChangeLoading && (pendingUser?.id === id)}
              disabled={(id === authenticatedUser!.id) || (!isVerified && !isActive)}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </LoadingButton>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    if (isAdminModalOpen) {
      const setUserList = async () => {
        const userListResponse = await list();

        if (userListResponse.success) {
          const { users } = userListResponse.data;
          setUsers(users);
        }
        else setError(userListResponse.error!);
      }

      setUserList();
    }
  }, [isAdminModalOpen]);

  useEffect(() => {
    if (users) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [users]);

  const updateUser = (id: number, props: Partial<User>) =>
    setUsers(users!.map(user => user.id === id ? { ...user, ...props } : user));

  return error
    ? (
      <ErrorAlert error={error} />
    ) : (
      <>
        {
          isLoading ? (
            <Box style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <CircularProgress size={80} />
            </Box>
          ) : (
            <>
              <DataGrid
                rows={users!}
                columns={columns}
                sx={{ backgroundColor: '#e3f8fa' }}
                hideFooter
                getRowClassName={(params) => (params.row.verified && params.row.active)
                  ? ''
                  : 'data-grid-row-inactive-user'}
              />

              {
                pendingUser && (
                  <ConfirmationDialog
                    text={`Are you sure you want to ${pendingUser.active ? 'deactivate' : 'activate'} 
                      user ${pendingUser.email}?`}
                    pendingAction={pendingAction}
                    isOpen={isConfirmDialogOpen}
                    setIsOpen={setIsConfirmDialogOpen}
                  />
                )
              }
            </>
          )
        }
      </>
  );
};

export {
  UsersDataGrid
};