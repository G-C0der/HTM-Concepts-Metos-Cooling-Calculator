import React, {useContext, useEffect, useState} from 'react';
import './style.css';
import {User} from "../../types";
import {AuthContext, UserContext} from "../../contexts";
import {Alert, CircularProgress} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {toAbsoluteUrl} from "../../utils/url";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from "@mui/material/Button";
import {ConfirmationDialog} from "../ConfirmationDialog/ConfirmationDialog";

interface UsersDataGridProps {
  isAdminModalOpen: boolean;
}

const UsersDataGrid = ({ isAdminModalOpen }: UsersDataGridProps) => {
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const [pendingUser, setPendingUser] = useState<User>();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(() => () => {});

  const { authenticatedUser } = useContext(AuthContext);
  const { list, activate, deactivate } = useContext(UserContext);

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
      width: 150
    },
    {
      field: 'lname',
      headerName: 'Last Name',
      width: 150
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
      width: 300,
      renderCell: (params) => (
        <a href={toAbsoluteUrl(params.value)} target="_blank" rel="noreferrer">
          {params.value}
        </a>
      ),
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
            <Button
              className={`action-button ${isActive ? 'deactivate' : 'activate'}`}
              startIcon={isActive ? <CancelIcon /> : <CheckCircleIcon />}
              onClick={() => {
                setPendingUser(params.row);
                setPendingAction(() => () => isActive ? deactivate(id) : activate(id));
                setIsConfirmDialogOpen(true);
              }}
              disabled={(id === authenticatedUser!.id) || (!isVerified && !isActive)}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </>
        );
      }
    }
  ];

  return error
    ? (
      <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
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