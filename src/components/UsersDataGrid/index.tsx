import React, {useContext, useEffect, useState} from 'react';
import './style.css';
import {ApiError, User} from "../../types";
import {AdminContext, AuthContext} from "../../contexts";
import {CircularProgress} from "@mui/material";
import {DataGridPremium, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import Box from "@mui/material/Box";
import {toAbsoluteUrl} from "../../utils/url";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {ConfirmationDialog} from "../ConfirmationDialog";
import {LoadingButton} from "../LoadingButton";
import {getName} from 'country-list';
import {ErrorAlert} from "../ErrorAlert";
import {userFieldLabels} from "../../constants";
import {UserDetailDataGrid} from "../UserDetailDataGrid";
import {BooleanIcon} from "../BooleanIcon";

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
  const { listUsers, activateUser, deactivateUser } = useContext(AdminContext);

  const columns: GridColDef[] = [
    {
      field: 'company',
      headerName: userFieldLabels['company'],
      width: 200
    },
    {
      field: 'title',
      headerName: userFieldLabels['title'],
      width: 60
    },
    {
      field: 'fname',
      headerName: userFieldLabels['fname'],
      width: 140
    },
    {
      field: 'lname',
      headerName: userFieldLabels['lname'],
      width: 140
    },
    {
      field: 'verified',
      headerName: userFieldLabels['verified'],
      width: 80,
      renderCell: ({ value }) => (
        <BooleanIcon value={value} />
      ),
    },
    {
      field: 'active',
      headerName: userFieldLabels['active'],
      width: 80,
      renderCell: ({ value }) => (
        <BooleanIcon value={value} />
      ),
    },
    {
      field: 'admin',
      headerName: userFieldLabels['admin'],
      width: 80,
      renderCell: ({ value }) => (
        <BooleanIcon value={value} />
      ),
    },
    {
      field: 'email',
      headerName: userFieldLabels['email'],
      width: 300,
      renderCell: ({ value }) => (
        <a href={`mailto:${value}`} target="_blank" rel="noreferrer">
          {value}
        </a>
      ),
    },
    {
      field: 'phone',
      headerName: userFieldLabels['phone'],
      width: 150
    },
    {
      field: 'website',
      headerName: userFieldLabels['website'],
      width: 250,
      renderCell: ({ value }) => (
        <a href={toAbsoluteUrl(value)} target="_blank" rel="noreferrer">
          {value}
        </a>
      ),
    },
    {
      field: 'country',
      headerName: userFieldLabels['country'],
      width: 160,
      valueGetter: ({ value }) => getName(value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: ({ row }) => {
        const id = row.id;
        const isVerified = row.verified;
        const isActive = row.active;

        return (
          <>
            <LoadingButton
              className={`action-button ${isActive ? 'deactivate' : 'activate'}`}
              startIcon={isActive ? <CancelIcon /> : <CheckCircleIcon />}
              onClick={() => {
                setPendingUser(row);
                setPendingAction(() => async () => {
                  setIsActiveStateChangeLoading(true);

                  if (isActive) {
                    const deactivateResponse = await deactivateUser(id);
                    if (deactivateResponse.success) updateUser(id, { active: !isActive });
                  } else {
                    const activateResponse = await activateUser(id);
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
        const userListResponse = await listUsers();

        if (userListResponse.success) setUsers(userListResponse.data!.users);
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
              <DataGridPremium
                rows={users!}
                columns={columns}
                sx={{ backgroundColor: '#e3f8fa' }}
                hideFooter
                slots={{ toolbar: GridToolbar }}
                getRowClassName={(params) => (params.row.verified && params.row.active)
                  ? ''
                  : 'data-grid-row-inactive-user'}
                getDetailPanelContent={({ row }) => <UserDetailDataGrid user={row} />}
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